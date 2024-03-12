const express = require('express');
const { slipReject, slipApprove,generateQRCode,fetchslip,approveSlip,rejectSlip,deleteSlip,deletecurrency, fetchCommission, fetchCommissiondetail} = require('../controllers/admin');

const router = express.Router();

// router.post("/:slipId",slipReject)
// router.post("/update/:slipId",slipApprove)
router.post('/generateqr', generateQRCode );
router.get('/slips',fetchslip);
router.post('/approveSlip', approveSlip);
router.post('/rejectSlip', rejectSlip);
router.get('/fetchcommission',fetchCommission)
router.post('/fetchcommissiondetail',fetchCommissiondetail)
router.delete('/deleteSlip/:slipId', deleteSlip);

router.delete('/deletecurrencies/:id',deletecurrency);
module.exports = router;