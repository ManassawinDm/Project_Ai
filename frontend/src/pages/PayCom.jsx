import axios from 'axios';
import React, { useEffect, useState } from 'react';

function PayCom() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const upload = async () => {
    if (!selectedFile) {
      alert('No file selected.');
      return; 
    }

    try {
      const formData = new FormData();
      formData.append("slip", selectedFile);
      const res = await axios.post("http://localhost:8800/api/upload", formData);
      console.log(res.data);
      alert("Upload successful"); 
    } catch (err) {
      console.log(err);
      alert("Upload failed"); 
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    upload();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center pb-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg">
              <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 7h16M12 11v8m8-8H4m8 0l-4 4m4-4l4 4"></path>
              </svg>
              <span className="text-blue-500 font-medium">Browse Files to upload</span>
            </div>
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
          <span className="text-gray-500">{selectedFile ? selectedFile.name : 'No selected File -'}</span>
        </div>
        <button onClick={handleUpload} className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
          UPLOAD
        </button>
      </div>
    </div>
  )
}

export default PayCom;
