import zmq
import json
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
import numpy as np
import datetime
import requests


## ------------------------ AI -----------------------
def fetch_data(symbol, start_date, end_date):
    data = yf.download(symbol, start=start_date, end=end_date)
    return data[['Close']]

def prepare_data(data, look_back=60):
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data.values.reshape(-1, 1))
    
    x_test = scaled_data[-look_back:]
    x_test = np.reshape(x_test, (1, look_back, 1))
    
    return x_test, scaler

def predict_price(model, x_test, scaler):
    prediction = model.predict(x_test)
    predicted_price = scaler.inverse_transform(prediction)
    return predicted_price[0][0]

# ----------------- CHECK ------------------------------
def handle_check_port_and_status(data):
    validation_response = send_to_check({"AccountNumber": data.get('AccountNumber')})
    print("Validation Response:", validation_response)

    # Check if account is valid and verified
    if validation_response.get('isValid') and validation_response.get('verify'):
        # Now, check if the commission check passes
        if validation_response.get('commissionCheck'):
            # All checks pass, proceed with prediction
            currency = data.get('Currency')
            date = data.get('date')

            end_date = datetime.datetime.strptime(date, '%Y-%m-%d')
            start_date = end_date - datetime.timedelta(days=150)
            currency_download = {
                "EURUSD": "EURUSD=X",
                "USDJPY": "USDJPY=X",
                "GOLD": "GC=F"
            }.get(currency)
            
            model_filename = {
                "EURUSD": "EURUSD_model.h5",
                "USDJPY": "USDJPY_model.h5",
                "GOLD": "GOLD_MODEL.h5"
            }.get(currency)

            if not currency_download or not model_filename:
                # Currency not supported
                return {"error": "Currency not supported"}
            
            try:
                model = load_model(model_filename)
                df = fetch_data(currency_download, start_date.strftime('%Y-%m-%d'), date)
                if df.empty:
                    return {"error": "No data available for the specified date and currency"}
                
                x_test, scaler = prepare_data(df, 60)  # 60 as the look_back period
                predicted_close = predict_price(model, x_test, scaler)
                print("Predicted Close Price:", predicted_close)
                return {"date": date, "predictedClose": float(predicted_close), "Currency": currency}
            
            except Exception as e:
                print(e)
                return {"error": "Failed to predict price. Please try again later."}
        else:
            # Commission check fails
            return {"error": "Please pay the commission."}
    else:
        # Account is either not valid or not verified
        return {"error": validation_response.get('message')}

    
#--------------------- Send To server Check -----------------
def send_to_check(data):
    url = 'http://localhost:8800/api/user/validateAccount'
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print(response.json())
            return response.json()
        else:
            print(f"Error: Received status code {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None





def handle_weekly_profit(data):
    url = 'http://localhost:8800/api/user/Commission'

    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("Weekly profit reported successfully.")
            return {"success": True, "message": "Weekly profit reported successfully"}
        else:
            print(f"Error: Received status code {response.status_code}")
            return {"success": False, "message":"Failed to report weekly profit"}
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {"success": False, "message": "Request failed"}



#--------------------- ZeroMQ Server --------------------
def server():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5552")

    print("Server is ready")

    while True:
        message = socket.recv_string()
        print("Received request: ", message)

        data = json.loads(message)
        message_type = data.get('messageType')

        if message_type == "checkPortandStatus":
            response = handle_check_port_and_status(data)
        elif message_type == "weeklyProfit":
             response = handle_weekly_profit(data)
        else:
            response = {"error": "Invalid messageType"}

        socket.send_string(json.dumps(response))

if __name__ == "__main__":
    server()