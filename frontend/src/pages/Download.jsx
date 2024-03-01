import React, { useState } from 'react';

function Download() {
  const [selectedCurrencyPair, setSelectedCurrencyPair] = useState('');

  const currencyPairs = [
    'EUR/USD',
    'USD/JPY',
    'GBP/USD',
    'AUD/USD',
    'USD/CAD',
    'USD/CHF',
    'NZD/USD',
    'EUR/GBP',
  ];

  const lotsize = ['0.01', '0.02', '0.03', '0.04', '0.05', '0.06', '0.07', '0.08', '0.09' , '0.1'];

  // Function to handle the download action
  const handleDownload = async (timeframe) => {
    // Assuming `fetchFileFromServer` is a function that fetches the file URL
    const fileUrl = `/path-to-your-file?currencyPair=${encodeURIComponent(selectedCurrencyPair)}&timeframe=${encodeURIComponent(timeframe)}`;
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok.');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${selectedCurrencyPair}_${timeframe}.csv`); // or the appropriate filename and extension
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('There was an issue downloading the file.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Select a Forex Currency Pair and Timeframe</h2>
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
            {lotsize.map((timeframe) => (
              <div key={timeframe} className="flex items-center justify-between">
                <label className="text-gray-600">{timeframe}</label>
                <button
                  className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => handleDownload(timeframe)}
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
