import React, { useState } from 'react';
import axios from 'axios';

function AddBot() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setname] = useState(''); 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    upload();
  };
  
  const upload = async () => {
    if (!selectedFile) {
      alert('No file selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('bot', selectedFile);
    formData.append('name', name); // Ensure this is correctly appending the name
  
    try {
      const response = await axios.post("http://localhost:8800/api/uploadBot", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert("Upload successful");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-lg font-bold">Add Currency</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input onChange={(e)=>{setname(e.target.value)}} type="text" id="name" name="name" placeholder="JPYUSD" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
          </div>

          <div className="mb-4">
            <label htmlFor="upload" className="block text-sm font-medium text-gray-700">Upload Bot</label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center">
                SELECT
                <input type="file" id="upload" name="upload" className="hidden" onChange={handleFileChange}/>
              </label>
              <span className="ml-4 text-sm text-gray-500">{selectedFile ? selectedFile.name : 'No file selected'}</span>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">CONFIRM</button>
        </form>
      </div>
    </div>
  )
}

export default AddBot;
