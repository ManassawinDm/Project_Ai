const express = require('express')
const { fetchUserData, addNewPort,validateAccount,Commission } = require('../controllers/users.js')
const { authenticateToken} = require('../controllers/auth.js')
const router = express()
router.get('/fetchUserData', authenticateToken, fetchUserData);
router.post("/addPort",authenticateToken, addNewPort);
router.post("/validateAccount", validateAccount);
router.post("/Commission",Commission);

module.exports =  router;