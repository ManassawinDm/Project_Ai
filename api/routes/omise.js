const express = require("express");
const Omisepayment = require("../controllers/omise");
const router = express.Router();

router.post('/payment', Omisepayment );


module.exports = router;