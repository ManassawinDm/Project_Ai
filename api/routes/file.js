const express = require('express');
const { uploadSlipHandler,uploadPortHandler,botAndImageUploadHandler,CurrencyUploadHandler,changeBacketestHTML } = require('../controllers/files');
const { authenticateToken } = require('../controllers/auth'); // Adjust the path as necessary

const router = express.Router();

router.post('/upload/slip',uploadSlipHandler);
router.post('/upload/port', uploadPortHandler);
router.post('/upload/botAndImage', botAndImageUploadHandler);
router.post('/addCurrency',CurrencyUploadHandler);
router.post('/process-backtest',changeBacketestHTML);
module.exports = router;
