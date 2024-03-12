import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function PayCom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { port_id, selectedTransactions, totalCommission } = location.state || {};
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [payerName, setPayerName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const response = await axios.post('http://localhost:8800/api/admin/generateqr', { amount: totalCommission });
        setQrCodeUrl(response.data.qrCodeUrl);
      } catch (error) {
        console.error("Error generating QR code: ", error.message);
      }
    };

    if (totalCommission) {
      generateQRCode();
    }
  }, [totalCommission]);

  const handleFileChange = (event) => {
    if (event.target.files[0] && event.target.files[0].type.startsWith('image/')) {
      setSelectedFile(event.target.files[0]);
      setErrorMessage(''); // Clear any existing error message
    } else {
      setErrorMessage('Please select an image file.');
      event.target.value = ''; // Reset file input
    }
  };

  const handleNameChange = (event) => {
    setPayerName(event.target.value);
    if (event.target.value.trim()) {
      setErrorMessage(''); // Clear any existing error message if name is now provided
    }
  };
const handleOpenSubmitDialog = () => {
  setOpenSubmitDialog(true);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if name or file is empty and show an error message if so
    if (!payerName.trim() || !selectedFile) {
      setErrorMessage('Please fill in your name and select an image file.');
      return;
    }

    setIsSubmitting(true);
    handleOpenSubmitDialog();
  };


  const confirmSubmit = async () => {
    const formData = new FormData();
    formData.append('name', payerName);
    formData.append('file', selectedFile);
    formData.append('selectedTransactions', JSON.stringify(selectedTransactions));
    formData.append('totalCommission', parseFloat(totalCommission).toFixed(2).toString());
  
    try {
      await axios.post('http://localhost:8800/api/file/upload/slip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await axios.post('http://localhost:8800/api/user/updatetransaction', {
        transactionIds: JSON.stringify(selectedTransactions),
      });
  
      // Success feedback
      toast.success('Submission successful!', {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
  
      setTimeout(() => {
        navigate('/history');
      }, 1000);
    } catch (error) {
      console.error("Failed to submit:", error);
      toast.error('Failed to submit. Please try again.', {
        // Additional toast configuration for error
      });
      setErrorMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false); // Enable the button again
      handleCloseSubmitDialog(); // Close dialog after submit
    }
  };
  
  const handleCloseSubmitDialog = () => {
    setIsSubmitting(false); // Also reset isSubmitting when dialog is manually closed
    setOpenSubmitDialog(false);
  };
  
  
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg">
        <ToastContainer />
      <div className="md:flex">
        <div className="w-full p-4">
          <div className="relative text-center">
            <h1 className="text-2xl font-bold">Pay Commission</h1>
            {qrCodeUrl && (
              <div className="my-4">
                <img className="mx-auto" src={qrCodeUrl} alt="QR Code" />
                <p className="text-sm mt-2">Scan to pay ฿{parseFloat(totalCommission).toFixed(2)}</p>
              </div>
            )}
          </div>
          {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              value={payerName}
              onChange={handleNameChange}
              className="px-4 py-2 border rounded-md"
              placeholder="Enter your name"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && <p className="text-sm text-gray-600">File selected: {selectedFile.name}</p>}
            <button
  type="button" // Keep as type="button" to prevent form submission
  onClick={handleOpenSubmitDialog}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
  disabled={isSubmitting} 
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>


          </form>
        </div>
        <Dialog
  open={openSubmitDialog}
  onClose={handleCloseSubmitDialog}
  aria-labelledby="submit-dialog-title"
  aria-describedby="submit-dialog-description"
>
  <DialogTitle id="submit-dialog-title">{"Confirm Submission"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="submit-dialog-description">
      Are you sure you want to submit this payment?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseSubmitDialog}>Cancel</Button>
    <Button onClick={confirmSubmit} autoFocus>
      Confirm
    </Button>
  </DialogActions>
</Dialog>

      </div>
    </div>
  );
}

export default PayCom;
