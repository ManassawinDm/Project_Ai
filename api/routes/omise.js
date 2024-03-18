const express = require("express");
const {Omisepayment, OmisepaymentBank, OmiseWebhook, getstatus, setstatus, OmisepaymentPromtpay} = require("../controllers/omise");
const router = express.Router();

router.post('/payment', Omisepayment );
router.post('/paymentBank', OmisepaymentBank );
router.post('/paymentpromtpay', OmisepaymentPromtpay );
router.post('/webhook', OmiseWebhook );
router.get('/getstatus', getstatus );
router.post('/setstatus', setstatus );


module.exports = router;