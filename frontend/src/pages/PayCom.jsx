import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function PayCom() {
  const location = useLocation();
  const { port_id, selectedTransactions, totalCommission } = location.state || {};
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [payerName, setPayerName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if name or file is empty and show an error message if so
    if (!payerName.trim() || !selectedFile) {
      setErrorMessage('Please fill in your name and select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('name', payerName);
    formData.append('file', selectedFile);
    formData.append('selectedTransactions', JSON.stringify(selectedTransactions));
    formData.append('totalCommission', parseFloat(totalCommission).toFixed(2).toString());

    try {
      const response = await axios.post('http://localhost:8800/api/file/upload/slip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const responseUpdateTransaction = await axios.post('http://localhost:8800/api/user/updatetransaction', {
  transactionIds: JSON.stringify(selectedTransactions)
});
      console.log(response.data); // Handle success
      // Clear form fields after successful submission
      setPayerName('');
      setSelectedFile(null);
      setErrorMessage('');
    } catch (error) {
      console.error("Failed to submit:", error);
      setErrorMessage('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg">
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
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PayCom;
