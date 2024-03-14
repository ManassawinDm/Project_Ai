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
import Imageviewr from '../component/imageview';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [selectedBacktestFile, setSelectedBacktestFile] = useState(null);
  const backtestFileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [botToDelete, setBotToDelete] = useState(null);
  const [selectedHtmlFile, setSelectedHtmlFile] = useState(null);
  const htmlFileInputRef = useRef(null);
  const handleImageClick = (imagePath) => {
    setCurrentImage(imagePath);
    setIsModalOpen(true);
  };

  const handleBacktestFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
  
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedBacktestFile(file);
      } else {
        alert('Invalid backtest image file type. Please upload only .jpg, .jpeg, .png, or .gif files.');
        event.target.value = '';
      }
    }
  };

  const handleOpenDeleteDialog = (botId) => {
    setBotToDelete(botId);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  
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
  
    if (!selectedBotFile || !selectedImgFile || selectedCurrencies.length === 0) {
      toast.warn('Please fill all the input',{position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,});
      return;
    }
  
    const formData = new FormData();
    formData.append('bot', selectedBotFile);
    formData.append('verificationImage', selectedImgFile);
    formData.append('backtestImage', selectedBacktestFile); 
    formData.append('backtestHtml', selectedHtmlFile);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('selectedCurrencies', JSON.stringify(selectedCurrencies));
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/file/upload/botAndImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        toast.success('Upload successful', {
position: "top-center",
autoClose: 1000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: false,
draggable: true,
progress: undefined,
});
  
        fetchBots();
  
        // Reset form and state
        botFileInputRef.current.value = "";
        imgFileInputRef.current.value = "";
        backtestFileInputRef.current.value = "";
        setName('');
        setDescription('');
        setSelectedBotFile(null);
        setSelectedImgFile(null);
        setSelectedBacktestFile(null);
        setSelectedCurrencies([]);
        htmlFileInputRef.current.value = "";
        setSelectedHtmlFile(null);

      }else{
        toast.error("Upload failed ",{position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,});
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Error",{
        position: "top-center",
autoClose: 1000,
hideProgressBar: false,
closeOnClick: true,
pauseOnHover: false,
draggable: true,
progress: undefined,
      });
    }
  };
  

useEffect(() => {
  // Fetch currencies when the component mounts
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/currencies`);
      setCurrencies(response.data.currencies);
    console.log(currencies)
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };
  fetchBots();
  fetchCurrencies();
}, []);

const fetchBots = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bot/getdata`);
    setBots(response.data);
    console.log(bots)
  } catch (error) {
    console.error('Error fetching bots:', error);
  }
};

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

const handleDeleteBot = async () => {
  if (botToDelete) {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/bot/${botToDelete}`);
      if (response.status === 200) {
        // Update the state to remove the deleted bot from the UI
        setBots(bots.filter(bot => bot.id !== botToDelete));
        // Show success toast
        toast.success('Bot deleted successfully.', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
      } else {
        // Handle server responses other than success, if any
        toast.error("Failed to delete bot  " , {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          });
      }
    } catch (error) {
      console.error('Failed to delete bot:', error);
      // Show error toast
      toast.error('Failed to delete bot. Error', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        });
    } finally {
      // Close the delete confirmation dialog regardless of outcome
      handleCloseDeleteDialog();
    }
  }
};
const handleHtmlFileChange = (event) => {
  const file = event.target.files[0];
  if (file && (file.type === "text/html" || file.name.endsWith('.htm'))) {
    setSelectedHtmlFile(file);
  } else {
    alert('Invalid file type. Please upload only .html or .htm files.');
    event.target.value = ''; // Reset the input value
  }
};
const handleBackTestClick = async (backtest, image) => {
  try {
    // Send a request to the server endpoint with the backtest HTML and image paths
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/file/process-backtest`, {
      backtestHtmlPath: backtest,
      backtestImagePath: image,
      URL : `${import.meta.env.VITE_API_URL}`
    });

    // Assuming the server returns the URL to the modified HTML
    const modifiedHtmlUrl = response.data.modifiedHtmlUrl;

    // Open the modified HTML in a new tab
    window.open(modifiedHtmlUrl, '_blank');
  } catch (error) {
    console.error('Failed to process backtest:', error);
  }
};


const [isImageModalOpen, setIsImageModalOpen] = useState(false);
const [currentImageURL, setCurrentImageURL] = useState('');


  return (
    <div className="container mx-auto px-4 mt-8 text-white">
       <ToastContainer />
    <h2 className="text-xl font-semibold text-center mb-6 text-[#00df9a]">Add Bot</h2>
    <form onSubmit={handleSubmit} className="mx-auto space-y-4 ">
    <div className="form-group">
    <label htmlFor="name" className="block text-lg font-medium text-[#00df9a]" >
          Bot Image
        </label>
          <input
            id="upload-img"
            type="file"
            className="form-input mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 text-black"
            onChange={handleImgFileChange}
            ref={imgFileInputRef} 
            accept="image/*"
          />
          <span className="ml-4 text-sm text-white">{selectedImgFile ? selectedImgFile.name : 'No image selected'}</span>
        </div>
      <div className="form-group">
        <label htmlFor="name" className="block text-lg font-medium text-[#00df9a]">
          Bot Name
        </label>
        <input
          type="text"
          className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
          placeholder="Enter bot name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="block text-lg font-medium text-[#00df9a]">
          Description
        </label>
        <textarea
          className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-black"
          rows="3"
          placeholder="Enter bot description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <FormControl 
  fullWidth 
  sx={{ 
    m: 1, 
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
  <InputLabel id="demo-multiple-checkbox-label">Currencies</InputLabel>
  <Select
    labelId="demo-multiple-checkbox-label"
    id="demo-multiple-checkbox"
    multiple
    value={selectedCurrencies}
    onChange={handleCurrencyChange}
    input={<OutlinedInput label="Currencies" />}
    renderValue={(selected) => selected.map((id) => currencies.find((currency) => currency.id === id)?.name).join(', ')}
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
    <MenuItem value="all">
      <Checkbox checked={isAllSelected} onChange={handleSelectAllClick}  sx={{ color: '#00df9a', '&.Mui-checked': { color: '#00df9a' }}} />
      <ListItemText primary="Select All"sx={{ color: '#00df9a' }} />
    </MenuItem>
    {currencies.map((currency) => (
      <MenuItem key={currency.id} value={currency.id}>
        <Checkbox checked={selectedCurrencies.includes(currency.id)}  sx={{ color: '#00df9a', '&.Mui-checked': { color: '#00df9a' }}}/>
        <ListItemText primary={currency.name} sx={{ color: '#00df9a' }}/>
      </MenuItem>
    ))}
  </Select>
</FormControl>
<div className="form-group">
  <label htmlFor="upload-html" className="block text-lg font-medium text-[#00df9a]">
    Upload Backtest HTML
  </label>
  <input
    id="upload-html"
    type="file"
    onChange={handleHtmlFileChange}
    ref={htmlFileInputRef}
    accept=".html, .htm"
    className="form-input mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
  />
  <span className="ml-4 text-sm text-white">{selectedHtmlFile ? selectedHtmlFile.name : 'No file selected'}</span>
</div>

<div className="form-group">
  <label htmlFor="upload-backtest" className="block text-lg font-medium text-[#00df9a]">
    Upload Backtest Image
  </label>
  <input
    id="upload-backtest"
    type="file"
    onChange={handleBacktestFileChange}
    ref={backtestFileInputRef}
    accept="image/*"
    className="form-input mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
  />
  <span className="ml-4 text-sm text-white">{selectedBacktestFile ? selectedBacktestFile.name : 'No image selected'}</span>
</div>


        <div className="form-group">
  <label htmlFor="upload-bot" className="block text-lg font-medium text-[#00df9a]">
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
  <span className="ml-4 text-sm text-white">{selectedBotFile ? selectedBotFile.name : 'No file selected'}</span>
</div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
      >
        Add Bot
      </button>
    </form>

    <h2 className="text-xl font-semibold text-center mb-6 mt-12 text-[#00df9a]">Available Bots</h2>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bots.map((bot) => (
        <div key={bot.id} className="bg-[#1a222c] p-4 shadow rounded-lg flex flex-col items-center">
          <img
            src={`${import.meta.env.VITE_API_URL}/${bot.image}`}
            alt={bot.name}
            className="w-20 h-20 object-cover mb-2"
          />
          <h5 className="text-lg font-bold">{bot.name}</h5>
          <p className="text-sm">{bot.description}</p>
          <p className="text-sm text-[#00df9a]">Currencies: {bot.currencies?.join(', ') ?? ''}</p>
          <button
  onClick={() => handleBackTestClick(bot.backtesthtml,bot.backtest)} 
  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
>
  BackTest
</button>

      <Button
  variant="contained"
  color="error"
  onClick={() => handleOpenDeleteDialog(bot.id)}
  sx={{ mt: 2 }}
>
  Delete Bot
</Button>
        </div>
      ))}
    </div>
    {isModalOpen && <Imageviewr imageUrl={currentImage} isOpen={isModalOpen} handleClose={() => setIsModalOpen(false)} />}
    <Dialog
  open={openDeleteDialog}
  onClose={handleCloseDeleteDialog}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title" sx={{ color: 'black' }}>
    {"Confirm Delete"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description" sx={{ color: 'black' }}>
      Are you sure you want to delete this bot?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
  <Button onClick={handleCloseDeleteDialog} sx={{ color: 'black' }}>Cancel</Button>
  <Button onClick={handleDeleteBot} autoFocus sx={{ color: 'red' }}>
    Delete
  </Button>
</DialogActions>

</Dialog>

  </div>

    
  );
}

export default AddBot;
