const express = require('express')
const { fetchUserData, addNewPort} = require('../controllers/users.js')
const { authenticateToken} = require('../controllers/auth.js')
const router = express()
router.get('/fetchUserData', authenticateToken, fetchUserData);
router.post("/addPort",authenticateToken, addNewPort);


module.exports =  router;