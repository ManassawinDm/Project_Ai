import React, { useState } from 'react';

function Download() {
  const [selectedCurrencyPair, setSelectedCurrencyPair] = useState('');

  const currencyPairs = [
    'EURUSD',
    'USDJPY',
    'GBPUSD',
    'AUDUSD',
    'USDCAD',
    'USDCHF',
    'NZDUSD',
    'EURGBP',
  ];

  const lotsize = ['0.01', '0.02', '0.03', '0.04', '0.05', '0.06', '0.07', '0.08', '0.09' , '0.1'];
  const handleDownload = async (currencyPair, lotSize) => {
    const fileUrl = `http://localhost:8800/download/${currencyPair}_${lotSize}.jpg`; 
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok.');
      console.log(response)
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${currencyPair}_${lotSize}.jpg`); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('There was an issue downloading the file.');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Select a Forex Currency Pair and lotsize</h2>
        <div>
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCurrencyPair}
            onChange={(e) => setSelectedCurrencyPair(e.target.value)}
          >
            <option value="">Select Currency Pair</option>
            {currencyPairs.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>
        {selectedCurrencyPair && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">Select Lotsize</h3>
            {lotsize.map((lotsize) => (
              <div key={lotsize} className="flex items-center justify-between">
                <label className="text-gray-600">{lotsize}</label>
                <button
                  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => handleDownload(selectedCurrencyPair,lotsize)}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Download;
