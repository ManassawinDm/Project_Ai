require("dotenv").config();
const QRCode = require('qrcode');
const generatePayload = require('promptpay-qr');
const db = require("../db.js");
var omise = require("omise")({
  publicKey: process.env.VITE_OMISE_PUBLIC_KEY,
  secretKey: process.env.VITE_OMISE_SECRET_KEY,
});
let slipData = {
  status: null,
  amount: null,
};

const Omisepayment = async (req, res, next) => {
  const { email, amount, token, port_id, selectedTransactions } = req.body;

  try {
    const customer = await omise.customers.create({
      email,
      description: port_id,
      card: token,
    });

    const charge = await omise.charges.create({
      amount: amount,
      currency: "thb",
      customer: customer.id,
    });

    if (charge.status === "successful" && selectedTransactions.length > 0) {
      const placeholders = selectedTransactions.map(() => "?").join(",");
      const sql = `UPDATE transaction SET Status = 1 WHERE Transaction_ID IN (${placeholders})`;

      await db.query(sql, selectedTransactions);
    }

    res.status(200).send({
      amount: charge.amount,
      status: charge.status,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred during the payment process." });
  }
  next();
};

const OmisepaymentBank = async (req, res, next) => {
  const { email,amount, token, selectedTransactions } = req.body;

  try {
    slipData.amount = amount;
    const charge = await omise.charges.create({
      amount: amount,
      currency: "thb",
      source: token,
      return_uri: "http://localhost:8110/profile",
      metadata: {
        email:email,
        selectedTransactions: selectedTransactions,
        amount: amount,
      },
    });

    res.status(200).send({
      amount: charge.amount,
      status: charge.status,
      authorizeUri: charge.authorize_uri,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred during the payment process." });
  }
  next();
};
const OmiseWebhook = async (req, res, next) => {
  const webhookData = req.body.data;
  const webhookKey = req.body.key;
  const TransactionsId = webhookData.metadata.selectedTransactions;
  try {
    slipData.status = webhookData.status;

    if (
      webhookKey == "charge.complete" &&
      webhookData.status === "successful" &&
      TransactionsId.length > 0
    ) {
      const placeholders = TransactionsId.map(() => "?").join(",");
      const sql = `UPDATE transaction SET Status = 1 WHERE Transaction_ID IN (${placeholders})`;

      await db.query(sql, TransactionsId);
    }

    res.status(200).send({ status: webhookData.status });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred during the payment process." });
  }
  next();
};
// const OmiseWebhook = (req, res, next) => {
//   console.log(req.body)
//   try {

//     res.status(200).send("webhook ok" );
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send({ error: "An error occurred during the payment process." });
//   }
//   next();
// };

const OmisepaymentPromtpay= async (req, res) => {
  const {amount,selectedTransactions,token} = req.body; 
  const mobileNumber = '0969415597';
  let imageQr
  
  try {
    slipData.amount = amount;
    const payload = generatePayload(mobileNumber, { amount });
    QRCode.toDataURL(payload, (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to generate QR code");
      }
      imageQr = url
    });
    
    const charge = await omise.charges.create({
      amount: amount,
      currency: 'THB',
      metadata: {
        selectedTransactions: selectedTransactions,
        amount: amount,
      },
      source: {
        type: 'promptpay',
        token:token,
        scannable_code:{
          image:{
            location: imageQr
          }
        }
      }
    });
    res.status(200).send({
      amount: charge.amount,
      status: charge.status,
      authorizeUri: charge.source.scannable_code.image.download_uri,
      secretApiKey:omise.secretKey
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).send('Payment processing failed');
  }
};

const getstatus = (req, res) => {
  try {
    res.status(200).send({ slipData: slipData });
  } catch (err) {
    res.status(500).send({ error: "Error GetStatus" });
  }
};
const setstatus = (req, res) => {
  try {
    (slipData.status = null), (slipData.amount = null);

    res.status(200).send({ slipData: slipData });
  } catch (err) {
    res.status(500).send({ error: "Error GetStatus" });
  }
};
module.exports = {
  Omisepayment,
  OmisepaymentBank,
  OmiseWebhook,
  OmisepaymentPromtpay,
  getstatus,
  setstatus,
};
