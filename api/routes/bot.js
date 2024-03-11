const express = require('express');
const router = express.Router();
const {getBots,deleteBot} = require('../controllers/bot');

router.get('/getdata', getBots);
router.delete('/:botId', deleteBot);

module.exports = router;
