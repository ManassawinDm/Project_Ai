import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';

function AddCurrency() {
  const [currencyName, setCurrencyName] = useState('');
  const [currencyImage, setCurrencyImage] = useState(null);
  const [yfinanceCurrency, setYfinanceCurrency] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState(null);
  
  const fetchCurrencies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8800/api/user/currencies');
      setCurrencies(response.data.currencies);
    } catch (err) {
      setError('Failed to fetch currencies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch of currencies
  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleDeleteCurrency = async (currencyId) => {
    console.log(currencyId)
    try {
        const response = await axios.delete(`http://localhost:8800/api/admin/deletecurrencies/${currencyId}`);
        console.log(response.data.message);
        
        // Filter out the deleted currency from the currencies state
        const updatedCurrencies = currencies.filter(currency => currency.id !== currencyId);
        setCurrencies(updatedCurrencies);
        
        setMessage('Currency deleted successfully.');
} catch (error) {
console.error('Failed to delete currency:', error);
setMessage(error.response?.data?.message || 'Error deleting currency.');
} 
};

  const handleNameChange = (event) => {
    setCurrencyName(event.target.value);
  };

  const handleImageChange = (event) => {
    setCurrencyImage(event.target.files[0]);
  };

  const handleYfinanceCurrencyChange = (event) => {
    setYfinanceCurrency(event.target.value);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setIsLoading(true);

  if (!currencyName.trim() || !currencyImage) {
    setMessage('Please enter a currency name and select an image.');
    setIsLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('name', currencyName);
  formData.append('image', currencyImage);
  formData.append('yfinanceIdentifier', yfinanceCurrency);

  try {
    const response = await axios.post('http://localhost:8800/api/file/addCurrency', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setMessage(response.data.message);
    setCurrencyName('');
    setCurrencyImage(null);
    setYfinanceCurrency('');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    fetchCurrencies();

  } catch (error) {
    console.error('Error adding currency:', error);
    setMessage(error.response?.data?.message || 'Error adding currency.');
  } finally {
    setIsLoading(false);
  }
};


  return (
<div className="container mx-auto px-4 mt-8 sm:max-w-lg lg:max-w-full" style={{ position: 'relative' }}>
  <h2 className="text-xl font-semibold text-center mb-6">Add Currency</h2>
  {message && (
    <div className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
      {message}
    </div>
  )}
  <form onSubmit={handleSubmit} className="mx-auto space-y-4">
    <div className="form-group">
      <label htmlFor="currencyName" className="block text-lg font-medium text-gray-700">
        Currency Name
      </label>
      <input
        id="currencyName"
        type="text"
        value={currencyName}
        onChange={handleNameChange}
        className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        placeholder="Enter currency name"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="yfinanceCurrency" className="block text-lg font-medium text-gray-700">
        Yahoo Finance Currency Identifier (e.g., USDJPY=X, EURUSD=X)
      </label>
      <input
        id="yfinanceCurrency"
        type="text"
        value={yfinanceCurrency}
        onChange={handleYfinanceCurrencyChange}
        className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        placeholder="Enter Yahoo Finance currency identifier"
      />
    </div>
    <div className="form-group">
      <label htmlFor="currencyImage" className="block text-lg font-medium text-gray-700">
        Currency Image
      </label>
      <input
        id="currencyImage"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="form-input mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        ref={fileInputRef} 
      />
    </div>
    {isLoading && <LinearProgress color="primary" />}
    <button
      type="submit"
      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
      disabled={isLoading}
    >
      Add Currency
    </button>
  </form>
  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {currencies.map((currency) => (
      <div key={currency.id} className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
        <img
          src={`http://localhost:8800/${currency.imagePath}`}
          alt={currency.name}
          className="w-20 h-20 object-cover mb-2"
        />
        <h5 className="text-lg font-bold">{currency.name}</h5>
        <p className="text-sm">{currency.yfinanceIdentifier}</p>
        <p className="text-sm text-gray-600">{new Date(currency.dateAdded).toLocaleDateString()}</p>
        {/* Delete Button */}
        <button
          onClick={() => handleDeleteCurrency(currency.id)}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
</div>

  );
}

export default AddCurrency;
