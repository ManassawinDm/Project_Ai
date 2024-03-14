import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { ToastContainer } from 'react-toastify';

function AddCurrency() {
  const [currencyName, setCurrencyName] = useState('');
  const [currencyImage, setCurrencyImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [currencyToDelete, setCurrencyToDelete] = useState(null);

  const fetchCurrencies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/currencies`);
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
  const handleOpenDeleteDialog = (currencyId) => {
    setCurrencyToDelete(currencyId);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleDeleteCurrency = async () => {
    if (currencyToDelete) {
      setIsLoading(true);
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/deletecurrencies/${currencyToDelete}`);
        const updatedCurrencies = currencies.filter(currency => currency.id !== currencyToDelete);
        setCurrencies(updatedCurrencies);
        toast.success('Currency deleted successfully.');
      } catch (error) {
        console.error('Failed to delete currency:', error);
        toast.error(error.response?.data?.message || 'Error deleting currency.');
      } finally {
        setIsLoading(false);
        handleCloseDeleteDialog(); // Close the dialog
      }
    }
  };
  

  const handleNameChange = (event) => {
    setCurrencyName(event.target.value);
  };

  const handleImageChange = (event) => {
    setCurrencyImage(event.target.files[0]);
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


  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/file/addCurrency`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setMessage(response.data.message);
    setCurrencyName('');
    setCurrencyImage(null);
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
<div className="container mx-auto px-4 mt-8 sm:max-w-lg lg:max-w-full text-white" style={{ position: 'relative' }} >
  <ToastContainer/>
  <h2 className="text-xl font-semibold text-center mb-6 text-[#00df9a]">Add Currency</h2>
  {message && (
    <div className={`text-center mb-4 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
      {message}
    </div>
  )}
  <form onSubmit={handleSubmit} className="mx-auto space-y-4">
    <div className="form-group">
      <label htmlFor="currencyName" className="block text-lg font-medium text-[#00df9a]">
        Currency Name
      </label>
      <input
        id="currencyName"
        type="text"
        value={currencyName}
        onChange={handleNameChange}
        className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
        placeholder="Enter currency name"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="currencyImage" className="block text-lg font-medium text-[#00df9a]">
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
      <div key={currency.id} className="bg-[#1a222c] p-4 shadow rounded-lg flex flex-col items-center">
        <img
          src={`${import.meta.env.VITE_API_URL}/${currency.imagePath}`}
          alt={currency.name}
          className="w-20 h-20 object-cover mb-2"
        />
        <h5 className="text-lg font-bold">{currency.name}</h5>
        <p className="text-sm text-[#ff4500]">MSE: {currency.mse}</p>
        <p className="text-sm text-[#00df9a]">{new Date(currency.dateAdded).toLocaleDateString()}</p>
        
        <button
  onClick={() => handleOpenDeleteDialog(currency.id)}
  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
  disabled={isLoading}
>
  Delete
</button>

      </div>
    ))}
    <Dialog
  open={openDeleteDialog}
  onClose={handleCloseDeleteDialog}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Are you sure you want to delete this currency?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
    <Button onClick={handleDeleteCurrency} autoFocus>
      Delete
    </Button>
  </DialogActions>
</Dialog>

  </div>
</div>

  );
}

export default AddCurrency;
