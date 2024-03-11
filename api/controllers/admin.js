const db = require("../db.js");
const QRCode = require('qrcode');
const generatePayload = require('promptpay-qr');
const fs = require('fs');
const path = require('path');
// const slipReject = async (req, res) => {
//   const { slipId } = req.params;
//   const { port_number } = req.body;

//   try {
//     const result = await db.query("DELETE FROM slipupload WHERE imagePath = ? AND port_number = ?", [slipId, port_number]);
//       res.status(200).send("Slip rejected successfully");

//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// const slipApprove = async(req, res) => {
//     const { slipId } = req.params;
//     const { port_number } = req.body;

//     try {
//       const result = await db.query("UPDATE slipupload SET status = 1 WHERE imagePath = ? AND port_number = ?", [slipId, port_number]);
//         res.status(200).send("Slip rejected successfully");

//     } catch (err) {
//       res.status(500).json(err);
//     }
//   };

const generateQRCode = (req, res) => {
  const { amount } = req.body;
  const mobileNumber = '0969415597';
  
  try {
    const payload = generatePayload(mobileNumber, { amount });
    QRCode.toDataURL(payload, (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Failed to generate QR code");
      }
      res.json({ qrCodeUrl: url, amount });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating QR code payload");
  }
};

const fetchslip = (req, res) => {
  const sqlQuery = 'SELECT * FROM uploadslip';

  db.query(sqlQuery, (err, result) => {
      if (err) {
          console.error('Error fetching slips:', err);
          return res.status(500).json({ message: 'Failed to fetch slips' });
      }
      // Transform filePath to be server accessible if needed
      const transformedResult = result.map(slip => ({
          ...slip
      }));
      res.json(transformedResult);
  });
}

const approveSlip = async (req, res) => {
  // Assume transactionIds is already parsed from JSON string to array
  const transactionIds = JSON.parse(req.body.transactionIds);

  try {
    // Start a transaction if you are updating multiple rows
    await db.beginTransaction();

    // Prepare the SQL query
    const updateQuery = 'UPDATE transaction SET status = 1 WHERE Transaction_ID = ?';

    // Update each transaction status to 1
    for (const id of transactionIds) {
      await db.query(updateQuery, [id]);
    }

    // Commit the transaction
    await db.commit();

    res.json({ message: "Transactions verified successfully." });
  } catch (error) {
    // If an error occurs, rollback any changes
    await db.rollback();

    console.error('Error verifying transactions:', error);
    res.status(500).json({ message: 'Failed to verify transactions' });
  }
};


const rejectSlip = async (req, res) => {
  // Assume transactionIds is already parsed from JSON string to array
  const transactionIds = JSON.parse(req.body.transactionIds);

  try {
    // Start a transaction if you are updating multiple rows
    await db.beginTransaction();

    // Prepare the SQL query
    const updateQuery = 'UPDATE transaction SET status = 2 WHERE Transaction_ID = ?';

    // Update each transaction status to 2
    for (const id of transactionIds) {
      await db.query(updateQuery, [id]);
    }

    // Commit the transaction
    await db.commit();

    res.json({ message: "Transactions rejected successfully." });
  } catch (error) {
    // If an error occurs, rollback any changes
    await db.rollback();

    console.error('Error rejecting transactions:', error);
    res.status(500).json({ message: 'Failed to reject transactions' });
  }
};

const deleteSlip = async (req, res) => {
  const { slipId } = req.params; // Assuming you're passing the slip ID as a parameter

  // First, fetch the file path from the database
  db.query('SELECT filePath FROM uploadslip WHERE uploadslip_id = ?', [slipId], (err, result) => {
      if (err) {
          console.error('Error fetching slip file path:', err);
          return res.status(500).json({ message: 'Internal server error' });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: 'Slip not found' });
      }

      const filePath = result[0].filePath;

      // Delete the file from the file system
      const fullPath = path.join(__dirname, filePath); // Adjust according to your directory structure

      fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr) {
              console.error('Error deleting file:', unlinkErr);
              return res.status(500).json({ message: 'Failed to delete the file' });
          }

          // Now delete the record from the database
          db.query('DELETE FROM uploadslip WHERE uploadslip_id = ?', [slipId], (deleteErr) => {
              if (deleteErr) {
                  console.error('Error deleting slip record:', deleteErr);
                  return res.status(500).json({ message: 'Failed to delete the record' });
              }

              res.json({ message: 'Slip and file deleted successfully' });
          });
      });
  });
};



const deletecurrency = async (req, res) => {
  const { id } = req.params;

  // Start the transaction
  db.beginTransaction(async (transactionErr) => {
    if (transactionErr) {
      console.error('Error starting transaction:', transactionErr);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Select currency details
    const selectSql = 'SELECT name, imagePath FROM currencies WHERE id = ?';
    
    db.query(selectSql, [id], (selectErr, selectResults) => {
      if (selectErr || selectResults.length === 0) {
        db.rollback(() => {
          console.error('Error finding currency:', selectErr);
          res.status(selectErr ? 500 : 404).json({ message: selectErr ? "Internal Server Error" : "Currency not found" });
        });
        return;
      }

      const currencyName = selectResults[0].name;
      const imagePath = selectResults[0].imagePath;
      const modelFilePath = path.join(__dirname, '../python', `${currencyName}_model.h5`);
      const fullImagePath = path.join(__dirname, '../api', imagePath);

      // Delete bot-currency associations
      const deleteBotCurrenciesSql = 'DELETE FROM bot_currencies WHERE currency_id = ?';
      db.query(deleteBotCurrenciesSql, [id], (deleteBotCurrenciesErr, deleteBotCurrenciesResult) => {
        if (deleteBotCurrenciesErr) {
          db.rollback(() => {
            console.error('Error deleting bot_currencies records:', deleteBotCurrenciesErr);
            res.status(500).json({ message: "Internal Server Error" });
          });
          return;
        }

        // Attempt to delete the files
        try {
          fs.unlinkSync(fullImagePath);
          fs.unlinkSync(modelFilePath);
        } catch (fileErr) {
          db.rollback(() => {
            console.error('Error deleting files:', fileErr);
            res.status(500).json({ message: "Internal Server Error" });
          });
          return;
        }

        // Delete the currency
        const deleteSql = 'DELETE FROM currencies WHERE id = ?';
        db.query(deleteSql, [id], (deleteErr, deleteResult) => {
          if (deleteErr) {
            db.rollback(() => {
              console.error('Error deleting currency:', deleteErr);
              res.status(500).json({ message: "Internal Server Error" });
            });
            return;
          }

          // Everything was successful, commit the transaction
          db.commit((commitErr) => {
            if (commitErr) {
              db.rollback(() => {
                console.error('Failed to commit transaction:', commitErr);
                res.status(500).json({ message: "Internal Server Error" });
              });
              return;
            }

            res.json({ message: "Currency, related bots, and files deleted successfully" });
          });
        });
      });
    });
  });
};


module.exports = {
  generateQRCode,
  fetchslip,
  approveSlip,
  rejectSlip,
  deleteSlip,
  deletecurrency
};