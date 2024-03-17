import argparse
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import math
import yfinance as yf
import pandas as pd
import math
import numpy as np
from datetime import datetime, timedelta
import sys
import os
import shutil
currency_to_yfinance = {
    # Forex
    "EURUSD": "EURUSD=X",
    "USDJPY": "USDJPY=X",
    "GBPUSD": "GBPUSD=X",
    "AUDUSD": "AUDUSD=X",
    "USDCHF": "USDCHF=X",
    "USDCAD": "USDCAD=X",
    "NZDUSD": "NZDUSD=X",
    "EURJPY": "EURJPY=X",
    "EURGBP": "EURGBP=X",
    "EURCAD": "EURCAD=X",
    "EURAUD": "EURAUD=X",
    "EURCHF": "EURCHF=X",
    "EURSEK": "EURSEK=X",
    "EURNOK": "EURNOK=X",
    "EURNZD": "EURNZD=X",
    "GBPJPY": "GBPJPY=X",
    "GBPCHF": "GBPCHF=X",
    "GBPCAD": "GBPCAD=X",
    "GBPAUD": "GBPAUD=X",
    "GBPNZD": "GBPNZD=X",
    "AUDJPY": "AUDJPY=X",
    "AUDCAD": "AUDCAD=X",
    "AUDCHF": "AUDCHF=X",
    "AUDNZD": "AUDNZD=X",
    "CADJPY": "CADJPY=X",
    "CHFJPY": "CHFJPY=X",
    "NZDJPY": "NZDJPY=X",
    "USDSGD": "USDSGD=X",
    "USDHKD": "USDHKD=X",
    "USDKRW": "USDKRW=X",
    "USDINR": "USDINR=X",
    "USDBRL": "USDBRL=X",
    "USDMXN": "USDMXN=X",
    "USDZAR": "USDZAR=X",
    "USDRUB": "USDRUB=X",
    "USDCNY": "USDCNY=X",
    "USDTRY": "USDTRY=X",
    "USDTHB": "USDTHB=X",
    "USDPHP": "USDPHP=X",
    "USDMYR": "USDMYR=X",
    "USDIDR": "USDIDR=X",
    "EURPLN": "EURPLN=X",
    "EURTRY": "EURTRY=X",
    "EURZAR": "EURZAR=X",
    "EURMXN": "EURMXN=X",
    "EURHUF": "EURHUF=X",
    "EURCZK": "EURCZK=X",
    # Commodities
    "GOLD": "GC=F",
    "SILVER": "SI=F",
    "OIL": "CL=F",
    "PLATINUM": "PL=F",
    "PALLADIUM": "PA=F",
    "COPPER": "HG=F",
    "NATURALGAS": "NG=F",
    "WHEAT": "ZW=F",
    "CORN": "ZC=F",
    "SOYBEAN": "ZS=F",
    # Indices
    "S&P500": "^GSPC",
    "DOWJONES": "^DJI",
    "NASDAQ": "^IXIC",
    "FTSE100": "^FTSE",
    
    "GER30": "^GDAXI",
    "JP225": "^N225",
    "HSI": "^HSI",
    # Stocks examples
    "APPLE": "AAPL",
    "GOOGLE": "GOOGL",
    "TESLA": "TSLA",
    "AMAZON": "AMZN",
    "FACEBOOK": "META",
    "NETFLIX": "NFLX",
    "ALIBABA": "BABA",
    "MICROSOFT": "MSFT",
    "NVIDIA": "NVDA",
    "VISA": "V",
    # Cryptocurrencies
    "BTCUSD": "BTC-USD",
    "ETHUSD": "ETH-USD",
    "XRPUSD": "XRP-USD",
    "BCHUSD": "BCH-USD",
    "LTCUSD": "LTC-USD",
    "EOSUSD": "EOS-USD",
    "BNBUSD": "BNB-USD",
    "XTZUSD": "XTZ-USD",
    "XLMUSD": "XLM-USD",
    "ADAUSD": "ADA-USD",
    # Bonds
    "US10Y": "US10YB=RR",
    "US30Y": "US30YB=RR",
    "GER10Y": "DE10YB=RR",
    }

def backup_model_file(model_dir, currency_name):
    current_model_path = os.path.join(model_dir, f"{currency_name}_model.h5")
    backup_model_path = os.path.join(model_dir, f"{currency_name}_model_backup.h5")

    if os.path.isfile(current_model_path):
        shutil.move(current_model_path, backup_model_path)
        print(f"Backed up the old model to {backup_model_path}")

def train_model(currency_name, end_date):
    yfinance_identifier = currency_to_yfinance.get(currency_name)
    
    if not yfinance_identifier:
        print(f"No yFinance identifier found for {currency_name}.", file=sys.stderr)
        sys.exit(1)
    
    ticker_symbol = yfinance_identifier
    end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
    start_date = (end_date_obj - timedelta(days=5*365)).strftime("%Y-%m-%d")
    df = yf.download(ticker_symbol, start=start_date, end=end_date)
    df.reset_index(inplace=True)
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    data = df.filter(['Close'])
    dataset = data.values  # convert the data frame to a numpy array
    training_data_len = math.ceil(len(dataset) * .8)  # number of rows to train the model on
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(dataset)
    train_data = scaled_data[0:training_data_len, :]

    # Split the data into x_train, y_train datasets
    x_train = []
    y_train = []
    for i in range(60, len(train_data)):
        x_train.append(train_data[i - 60:i, 0])
        y_train.append(train_data[i, 0])

    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Define and compile the LSTM model
    model = Sequential()
    model.add(LSTM(64, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    model.add(LSTM(64, return_sequences=False))
    model.add(Dense(32))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train the model
    history = model.fit(x_train, y_train, batch_size=1, epochs=1)
    mse = history.history['loss'][-1]  # Get the last MSE value from training
    print(f"MSE:{mse}")
    backup_model_file('./python', currency_name)
    try:
        # Save the model with currency name
        model.save(f"./python/{currency_name}_model.h5")
        print(f"Model for {currency_name} saved successfully.")
    except Exception as e:
        print(f"Error saving the model for {currency_name}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train LSTM model for currency prediction")
    parser.add_argument("currencyName", type=str, help="Name of the currency")
    parser.add_argument("endDate", type=str, help="End date for fetching historical data (YYYY-MM-DD)")

    args = parser.parse_args()

    # Call train_model function with parsed arguments
    train_model(args.currencyName, args.endDate)
