import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Download() {
  const [bots, setBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState('');

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/bot/getdata');
        setBots(response.data.bots);
        if (response.data.bots.length > 0) {
          console.log(bots)
          setSelectedBotId(response.data.bots[0].botId.toString());
        }
      } catch (error) {
        console.error('Error fetching bots:', error);
      }
    };

    fetchBots();
  }, []);

  const selectedBot = bots.find(bot => bot.botId.toString() === selectedBotId);

  const handleDownloadClick = () => {
    if (!selectedBot) {
      alert('Please select a bot to download.');
      return;
    }
  
    const downloadUrl = `http://localhost:8800/${selectedBot.botPath}`; // Adjust the path as necessary
  
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', selectedBot.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  
  return (
    <div className="flex flex-col items-center p-4 mt-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gray-200 rounded-lg overflow-hidden w-full md:w-1/2 mb-4 md:mb-0">
            {selectedBot && (
              <img
                src={`http://localhost:8800/${selectedBot.imagePath}`}
                alt={selectedBot.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 flex-grow w-full md:w-1/2 md:ml-4">
            <div className="space-y-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Select Bot
              </label>
              <select
                value={selectedBotId}
                onChange={(e) => setSelectedBotId(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              >
                {bots.map((bot) => (
                  <option key={bot.botId} value={bot.botId.toString()}>
                    {bot.name}
                  </option>
                ))}
              </select>
              {selectedBot && (
                <>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <p className="text-gray-800 mb-4">{selectedBot.description}</p>
                  <button
                    onClick={handleDownloadClick}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                  >
                    Download Bot
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Download;
