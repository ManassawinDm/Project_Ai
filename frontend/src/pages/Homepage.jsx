import { useState, useEffect } from 'react';
import ProcessFlowIcon1 from '../assets/robot.png';
import ProcessFlowIcon2 from '../assets/MT4.jpeg';
import ProcessFlowIcon3 from '../assets/chart.png';
import BotImage from '../assets/downloadbot.png';
import axios from 'axios';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import Imageviewr from '../component/imageview';
function Homepage() {
  const [isBacktestModalOpen, setIsBacktestModalOpen] = useState(false);
  const [currentBacktestImage, setCurrentBacktestImage] = useState('');
  
  const [bots, setBots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [currencies, setCurrencies] = useState([]);
// Add a useEffect to fetch the bots when the component mounts
useEffect(() => {
  const fetchBots = async () => {
    // Fetch bots and currencies on component mount
    try {
      const botsResponse = await axios.get('http://localhost:8800/api/bot/getdata');
      setBots(botsResponse.data);
      const currenciesResponse = await axios.get('http://localhost:8800/api/user/currencies');
      setCurrencies(currenciesResponse.data.currencies);
      console.log(bots)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchBots();
}, []);

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value.toLowerCase());
};

const handleCurrencyChange = (event) => {
  setSelectedCurrencies(event.target.value);
};

// Filter bots based on search term and selected currencies
const filteredBots = bots.filter(
  (bot) =>
    bot.name.toLowerCase().includes(searchTerm) &&
    (selectedCurrencies.length === 0 ||
      selectedCurrencies.some((currency) =>
        bot.currencies.includes(currency)))
        
);
  // Call this function when a user clicks the download button
  const handleDownloadBot = (bot) => {
    const downloadUrl = `http://localhost:8800/${bot.bot}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', bot.name); // This will download the file with the bot's name
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleViewBacktest = (image) => {
    setCurrentBacktestImage(`http://localhost:8800/${image}`);
    setIsBacktestModalOpen(true);
  };
  
  return (
    <div className="text-white bg-[#000300]">
    <div className="container mx-auto p-6 ">
<div className="container mx-auto p-6 lg:flex lg:items-center lg:justify-between">
  <div className="lg:w-3/5 space-y-6">
    <h1 className="text-4xl  text-[#00df9a] font-bold">About Bot</h1>
    <p className="text-lg">
    Unlock convenience with our intuitive bot interface. Navigate effortlessly through our streamlined 
    process. Experience ease at every step. Simplify your tasks with our user-friendly bot.
    </p>
    
    <div className="container mx-auto p-6 flex flex-col items-center  bg-[#000300] rounded-lg shadow">
      <div className="flex flex-wrap items-center justify-center md:justify-start space-x-0 md:space-x-4 my-4">
        <div className="flex flex-col items-center px-2 py-4 md:py-0">
          <div className="p-4 bg-white rounded-full shadow">
            <img src={ProcessFlowIcon1} alt="Download Bot" className="h-12 w-12"/>
          </div>
          <p className="mt-2 text-sm font-semibold">Download Bot</p>
        </div>
        <div className="hidden md:block text-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </div>
        <div className="flex flex-col items-center px-2 py-4 md:py-0">
          <div className="p-4 bg-white rounded-full shadow">
            <img src={ProcessFlowIcon2} alt="Apply bot to MT4" className="h-12 w-12"/>
          </div>
          <p className="mt-2 text-sm font-semibold">Apply bot to MT4</p>
        </div>
        <div className="hidden md:block text-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </div>
        <div className="flex flex-col items-center px-2 py-4 md:py-0">
          <div className="p-4 bg-white rounded-full shadow">
            <img src={ProcessFlowIcon3} alt="Start bot and Enjoy trading" className="h-12 w-12"/>
          </div>
          <p className="mt-2 text-sm font-semibold">Start bot and Enjoy trading</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start md:space-x-6 my-4">
      <div className="flex items-center justify-center bg-green-100 py-2 px-4 rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <div className="text-left">
            <p className="font-bold text-sm text-green-800">Backtest & AI</p>
          </div>
        </div>
       
      </div>
    </div>
  </div>
  <div className="lg:w-2/5 flex lg:justify-center lg:items-center">
      <img src={BotImage} alt="Bot" className="max-w-full lg:max-w-xl h-auto mx-auto"/>
    </div>
  </div>



      <div className="flex flex-col lg:flex-row justify-between items-center my-4">
        <h2 className="text-2xl font-bold mb-4 text-[#00df9a] lg:mb-0">Available Bots</h2>

        <div className="flex flex-wrap   items-center justify-between gap-4">
          <div className="w-full  lg:w-auto">
          <FormControl 
  fullWidth 
  sx={{ 
    m: 1, 
    width: 300,
    '& .MuiInputLabel-root': { // Target the label
      color: '#00df9a',
    }, 
    '& .MuiOutlinedInput-root': { // Target the input outline
      '& fieldset': {
        borderColor: '#00df9a',
      },
      '&:hover fieldset': {
        borderColor: '#00df9a',
      },
      '&.Mui-focused fieldset': { // Apply the color for focused state
        borderColor: '#00df9a',
      }
    },
    '& .MuiSvgIcon-root': { // Adjust icon color
      color: '#00df9a',
    },
    '& .MuiCheckbox-root': { // Adjust checkbox color
      color: '#00df9a',
    },
    '& .MuiButtonBase-root': { // Adjust dropdown button color on focus
      '&:hover': {
        bgcolor: 'transparent', // Maintain background color when hovered
      },
    },
    '.MuiSelect-select': { // Color of the selected item text
      color: '#00df9a',
    },
    bgcolor: '#000300', // Background color for the form control
    color: '#00df9a', // Text color
  }}
>
  <InputLabel id="currency-select-label">Filter by Currency</InputLabel>
  <Select
    labelId="currency-select-label"
    id="currency-select"
    multiple
    value={selectedCurrencies}
    onChange={handleCurrencyChange}
    input={<OutlinedInput label="Filter by Currency" />}
    renderValue={(selected) => selected.join(', ')}
    MenuProps={{
      PaperProps: {
        sx: {
          bgcolor: '#000300', // Background color for the dropdown
          '& .MuiMenuItem-root': {
            '&.Mui-selected': { // Background color for selected item
              backgroundColor: 'rgba(0, 157, 154, 0.2)', // A lighter shade of the accent color for selected items
            },
            '&:hover': {
              backgroundColor: 'rgba(0, 157, 154, 0.1)', // A very light shade of the accent color for hover
            },
          },
        },
      },
    }}
  >
    {currencies.map((currency) => (
      <MenuItem key={currency.id} value={currency.name}>
        <Checkbox checked={selectedCurrencies.includes(currency.name)} sx={{ color: '#00df9a', '&.Mui-checked': { color: '#00df9a' }}}/>
        <img
          src={`http://localhost:8800/${currency.imagePath}`} // Adjust the path as needed
          alt={currency.name}
          style={{ width: '24px', height: '24px', marginRight: '10px' }}
        />
        <ListItemText primary={currency.name} sx={{ color: '#00df9a' }}/>
      </MenuItem>
    ))}
  </Select>
</FormControl>

          </div>

          <div className="w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search bots..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-input w-full px-3 py-2 border bg-[#000300] border-green-300  rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredBots.map((bot) => (
            <div key={bot.id} className="bg-[#000300] p-4 shadow rounded-lg flex flex-col items-center">
              <img
                src={`http://localhost:8800/${bot.image}`}
                alt={bot.name}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
             <h5 className="text-lg font-bold">{bot.name}</h5>
          <p className="text-sm">{bot.description}</p>
          <p className="text-sm text-gray-400">Currencies: {bot.currencies.join(', ')}</p>
          <span
  onClick={() => handleViewBacktest(bot.backtest)}
  className="mt-2 text-green-600 px-4 py-2 cursor-pointer"
>
  View Backtest
</span>

          <button
  className="mt-4 bg-green-500 text-white px-6 py-2 rounded shadow-lg hover:bg-green-600 transition-colors duration-200"
  onClick={() => handleDownloadBot(bot)}
>
  Download {bot.name}
</button>
            </div>
          ))}
      </div>
    </div>
    <Imageviewr
  imageUrl={currentBacktestImage}
  isOpen={isBacktestModalOpen}
  handleClose={() => setIsBacktestModalOpen(false)}
/>
      </div>

  );
}

export default Homepage;