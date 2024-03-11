import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';

function AddBot() {
  const [selectedBotFile, setSelectedBotFile] = useState(null);
  const [selectedImgFile, setSelectedImgFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [bots, setBots] = useState([]);
  const botFileInputRef = useRef(null);
  const imgFileInputRef = useRef(null);
  
  const isAllSelected = 
  currencies.length > 0 && selectedCurrencies.length === currencies.length;
  const handleSelectAllClick = () => {
    setSelectedCurrencies(isAllSelected ? [] : currencies.map(currency => currency.id));
  };


  const handleBotFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const allowedExtensions = ['.mq4', '.ex4', '.mq5', '.ex5'];

      const fileName = file.name;

      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedBotFile(file);
      } else {
        alert('Invalid bot file type. Please upload only .mq4, .ex4, .mq5, or .ex5 files.');
        event.target.value = '';
      }
    }
  };

  const handleImgFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

      const fileName = file.name;

      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedImgFile(file);
      } else {
        alert('Invalid image file type. Please upload only .jpg, .jpeg, .png, or .gif files.');
        event.target.value = '';
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(JSON.stringify(selectedCurrencies))
    if (!selectedBotFile || !selectedImgFile || selectedCurrencies.length === 0) {
      alert('Please select both bot file, image and currencies.');
      return;
    }

    // Combine both files and other data into a single FormData object
    const formData = new FormData();
    formData.append('bot', selectedBotFile);
    formData.append('verificationImage', selectedImgFile);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('selectedCurrencies', JSON.stringify(selectedCurrencies));

    try {
      // Adjust the URL to the endpoint that handles bot and image uploads together
      const response = await axios.post("http://localhost:8800/api/file/upload/botAndImage", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      alert("Upload successful");
      if (response.status === 200) { // Or your success condition
        // Reset file input fields
        botFileInputRef.current.value = "";
        imgFileInputRef.current.value = "";
      }
      
      setName('');
      setDescription('');
      setSelectedBotFile(null);
      setSelectedImgFile(null);
      setSelectedCurrencies([]);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
};

useEffect(() => {
  // Fetch currencies when the component mounts
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/user/currencies');
      setCurrencies(response.data.currencies);
      // console.log(currencies)
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  fetchCurrencies();
}, []);

useEffect(() => {
  // Fetch bots on component mount
  const fetchBots = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/bot/getdata');
      setBots(response.data); 
      console.log(bots)
    } catch (error) {
      console.error('Error fetching bots:', error);
    }
  };

  fetchBots();
}, []);
const handleCurrencyChange = (event) => {
  const value = event.target.value;
  // Handling the "Select All" option
  if (value.includes("all")) {
    if (isAllSelected) {
      setSelectedCurrencies([]);
    } else {
      setSelectedCurrencies(currencies.map((currency) => currency.id));
    }
  } else {
    setSelectedCurrencies(value);
  }
};

const handleDeleteBot = async (botId) => {
  try {
    console.log(botId)
    const response = await axios.delete(`http://localhost:8800/api/bot/${botId}`);
    if (response.status === 200) {
      // Optionally, filter out the deleted bot from the bots state to update the UI
      setBots(bots.filter(bot => bot.id !== botId));
      alert('Bot deleted successfully.');
    }
  } catch (error) {
    console.error('Failed to delete bot:', error);
    alert('Failed to delete bot.');
  }
};

  return (
    <div className="container mx-auto px-4 mt-8">
    <h2 className="text-xl font-semibold text-center mb-6">Add Bot</h2>
    <form onSubmit={handleSubmit} className="mx-auto space-y-4">
    <div className="form-group">
    <label htmlFor="name" className="block text-lg font-medium text-gray-700">
          Bot Image
        </label>
          <input
            id="upload-img"
            type="file"
            className="form-input mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            onChange={handleImgFileChange}
            ref={imgFileInputRef} 
            accept="image/*"
          />
          <span className="ml-4 text-sm text-gray-500">{selectedImgFile ? selectedImgFile.name : 'No image selected'}</span>
        </div>
      <div className="form-group">
        <label htmlFor="name" className="block text-lg font-medium text-gray-700">
          Bot Name
        </label>
        <input
          type="text"
          className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          placeholder="Enter bot name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="block text-lg font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          rows="3"
          placeholder="Enter bot description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <FormControl fullWidth className="mt-4">
  <InputLabel id="demo-multiple-checkbox-label">Currencies</InputLabel>
  <Select
    labelId="demo-multiple-checkbox-label"
    id="demo-multiple-checkbox"
    multiple
    value={selectedCurrencies}
    onChange={handleCurrencyChange}
    input={<OutlinedInput label="Currencies" />}
    renderValue={(selected) => selected.map((id) => currencies.find((currency) => currency.id === id)?.name).join(', ')}
  >
    <MenuItem value="all">
      <Checkbox checked={isAllSelected} onChange={handleSelectAllClick} />
      <ListItemText primary="Select All" />
    </MenuItem>
    {currencies.map((currency) => (
      <MenuItem key={currency.id} value={currency.id}>
        <Checkbox checked={selectedCurrencies.includes(currency.id)} />
        <ListItemText primary={currency.name} />
      </MenuItem>
    ))}
  </Select>
</FormControl>


        <div className="form-group">
  <label htmlFor="upload-bot" className="block text-lg font-medium text-gray-700">
    Upload Bot File
  </label>
  <input
    id="upload-bot"
    type="file"
    onChange={handleBotFileChange}
    ref={botFileInputRef}
    accept=".mq4, .ex4, .mq5, .ex5"
    className="form-input mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
  />
  <span className="ml-4 text-sm text-gray-500">{selectedBotFile ? selectedBotFile.name : 'No file selected'}</span>
</div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
      >
        Add Bot
      </button>
    </form>

    <h2 className="text-xl font-semibold text-center mb-6 mt-12">Available Bots</h2>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bots.map((bot) => (
        <div key={bot.id} className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
          <img
            src={`http://localhost:8800/${bot.image}`}
            alt={bot.name}
            className="w-20 h-20 object-cover mb-2"
          />
          <h5 className="text-lg font-bold">{bot.name}</h5>
          <p className="text-sm">{bot.description}</p>
          <p className="text-sm text-gray-600">Currencies: {bot.currencies.join(', ')}</p>
          <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteBot(bot.id)}
              sx={{ mt: 2 }} // Add some margin to the top for spacing
            >
              Delete Bot
            </Button>
        </div>
      ))}
    </div>
  </div>

    
  );
}

export default AddBot;
