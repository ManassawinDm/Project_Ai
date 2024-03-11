const express = require('express')
const { fetchUserData, addNewPort,fetchhistory,validateAccount,Commission,getVerificationData,verifyPort,rejectPort,fetchSlip,payCommissions,gettransaction,updatetransaction,fetchcurrency } = require('../controllers/users.js')
const { authenticateToken} = require('../controllers/auth.js')
const router = express()
router.get('/fetchUserData', authenticateToken, fetchUserData);
router.post("/addPort",authenticateToken, addNewPort);
router.post("/validateAccount", validateAccount);
router.post("/Commission",Commission);
router.get("/check/port",getVerificationData);
router.post("/verify/:id", verifyPort);
router.post("/reject/:id", rejectPort);
router.get('/fetchSlip', authenticateToken, fetchSlip);
router.post('/api/transactions/pay', payCommissions);
router.get('/transactions/:portId',gettransaction);
router.post('/updatetransaction',updatetransaction)
router.get('/currencies',fetchcurrency);
router.get('/history/:portId',fetchhistory);
module.exports =  router;