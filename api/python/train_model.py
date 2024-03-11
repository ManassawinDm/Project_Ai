import argparse
import pandas_datareader as web
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM
import math
import yfinance as yf
import pandas as pd
import math
import numpy as np
from datetime import datetime, timedelta

def train_model(yfinance_identifier, end_date, currency_name):
    # Use yfinance identifier as ticker symbol
    ticker_symbol = f"{yfinance_identifier}"

    # Download data directly from yfinance
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
    model.fit(x_train, y_train, batch_size=1, epochs=1)

    try:
        # Save the model with currency name
        model.save(f"./python/{currency_name}_model.h5")
        print(f"Model for {currency_name} saved successfully.")
    except Exception as e:
        print(f"Error saving the model for {currency_name}: {e}")

if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Train LSTM model for currency prediction")
    parser.add_argument("yfinance", type=str, help="YFinance identifier for the currency")
    parser.add_argument("endDate", type=str, help="End date for fetching historical data (YYYY-MM-DD)")
    parser.add_argument("currencyName", type=str, help="Name of the currency")

    args = parser.parse_args()

    # Define start date
    start_date = "2018-01-01"

    # Call train_model function with parsed arguments
    train_model(args.yfinance, args.endDate, args.currencyName)
