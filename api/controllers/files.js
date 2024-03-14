const fs = require('fs');
const path = require('path');
const db = require('../db');
const multer = require('multer');
const { spawn } = require('child_process');
require('dotenv').config();
// Slip Upload Configuration
const storageForSlip = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure uploads directory exists or create it
      const uploadPath = path.resolve(__dirname, '../public/user/slip');
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Or any other logic for filename
    }
  });

//Bot Upload Configuration
const storageForBot = multer.diskStorage({
    destination: (req, file, cb) => {
        const botPath = path.resolve(__dirname, '../public/bot');
        fs.mkdirSync(botPath, { recursive: true });
        cb(null, botPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

//Port Upload Configuration
const storageForport = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure uploads directory exists or create it
      const uploadPath = path.resolve(__dirname, '../public/user/port');
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const storageForBotandImage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        switch (file.fieldname) {
            case 'bot':
                uploadPath = path.resolve(__dirname, '../public/bot');
                break;
            case 'verificationImage':
                uploadPath = path.resolve(__dirname, '../public/botimage');
                break;
            case 'backtestImage':
                uploadPath = path.resolve(__dirname, '../public/backtestimage');
                break;
            case 'backtestHtml': // Handle the .htm file for the backtest report
                uploadPath = path.resolve(__dirname, '../public/backtesthtml');
                break;
        }
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
const storageForCurrency = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(__dirname, '../public/currency');
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const uploadCurrencyImage = multer({ storage: storageForCurrency }).single('image');
  

const uploadBotandImage = multer({ storage: storageForBotandImage });

const uploadSlip = multer({ storage: storageForSlip }).single('file');
const uploadPort = multer({ storage: storageForport }).single('verificationImage');

// Slip Upload Handler
// const uploadSlipHandler = (req, res) => {
    
//     uploadSlip(req, res, (error) => {
//         if (error) {
//             return res.status(500).json({ message: "Error uploading file", error: error.message });
//         }
//         if (!req.file) {
//             return res.status(400).send("No file uploaded.");
//         }
      
//         // Use decodeURIComponent to handle filenames with special characters
//         const filename = decodeURIComponent(req.file.filename);

//         // Use path.basename to get the filename with extension only
//         const cleanFilename = path.basename(filename);
//         console.log(filename)
//         console.log(cleanFilename)
//         const portNumber = req.body.portNumber;
//         console.log(req.body)
//         const portQuery = "SELECT port_id FROM Ports WHERE port_number = ?";

//         db.query(portQuery, [portNumber], (err, portResults) => {
//             if (err) {
//                 console.error("Database error:", err);
//                 return res.status(500).send("Internal Server Error.");
//             }
        
//             if (portResults.length === 0) {
//                 return res.status(404).send("Port number not found.");
//             }
        
//             const portId = portResults[0].port_id;

//             const relativeFilePath = `uploads/slip/${cleanFilename}`;
        
//             const insertFileQuery = "INSERT INTO fileslips (filename, filepath, upload_date, port_id) VALUES (?, ?, NOW(), ?)";
//             db.query(insertFileQuery, [cleanFilename, relativeFilePath, portId], (insertErr, insertResult) => {
//                 if (insertErr) {
//                     console.error("Insert file error:", insertErr);
//                     return res.status(500).send("Internal Server Error when inserting file.");
//                 }
        
//                 res.json({
//                     success: true,
//                     message: "Slip upload successful",
//                     filePath: relativeFilePath, // Send the relative path to be used in the client side
//                     portNumber: portNumber
//                 });
//             });
//         });
//     });
// };


const uploadSlipHandler = (req, res) => {
    uploadSlip(req, res, async (error) => {
        if (error) {
            return res.status(500).json({ message: "Error uploading file", error: error.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        try {
            const { name, selectedTransactions, totalCommission } = req.body;
            const relativeFilePath = path.relative(__dirname, req.file.path); // Convert to relative path

            const transactionsArray = JSON.parse(selectedTransactions); // If it's sent as a JSON string

            const sql = "INSERT INTO uploadslip (name, filePath, transactions) VALUES (?, ?, ?)";
            await db.query(sql, [name, relativeFilePath, JSON.stringify(transactionsArray)]);

            res.json({ message: 'Payment processed successfully', filePath: relativeFilePath });
        } catch (dbError) {
            console.error('Database operation failed:', dbError);
            res.status(500).json({ message: 'Failed to process payment' });
        }
    });
};


const uploadPortHandler = (req, res) => {
    uploadPort(req, res, (error) => {
        if (error) {
            return res.status(500).json({ message: "Error uploading file", error: error.message });
        }
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const portId = req.body.portId;
        if (!portId) {
            return res.status(400).json({ message: "Port ID is required." });
        }

        // Calculate the relative file path from the server root directory
        const relativeFilePath = path.relative(path.resolve(__dirname, '..'), req.file.path);

        // Assuming you have a valid portId and a corresponding record in your Ports table
        // Here you insert the file information along with the portId into your verifyport table
        const insertVerifyPortQuery = "INSERT INTO verifyport (filename, filepath, port_id) VALUES (?, ?, ?)";

        // Use the original file name or modify it as per your requirements
        const originalFileName = req.file.originalname;

        db.query(insertVerifyPortQuery, [originalFileName, relativeFilePath, portId], (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Insert file error:", insertErr);
                return res.status(500).send("Internal Server Error when inserting file.");
            }
            res.json({
                success: true,
                message: "Port verification image uploaded successfully",
                filePath: relativeFilePath, // This will be the path relative to the server root
                portNumber: portId // Assuming portNumber is what you intended to send back
            });
        });
    });
}


const botAndImageUploadHandler = (req, res) => {
    uploadBotandImage.fields([
        { name: 'bot', maxCount: 1 },
        { name: 'verificationImage', maxCount: 1 },
        { name: 'backtestImage', maxCount: 1 },
        { name: 'backtestHtml', maxCount: 1 } // Accept a backtestHtml file
    ])(req, res, (error) => {
        if (error) {
            return res.status(500).json({ message: "Error uploading files", error: error.message });
        }

        // Ensure all files are uploaded, including the backtestHtml file
        if (!req.files['bot'] || !req.files['verificationImage'] || !req.files['backtestImage'] || !req.files['backtestHtml']) {
            return res.status(400).send("All files must be uploaded.");
        }
    

        const botFile = req.files['bot'][0];
        const imageFile = req.files['verificationImage'][0];
        const backtestImageFile = req.files['backtestImage'][0];
        const backtestHtmlFile = req.files['backtestHtml'][0];
        const { name, description, selectedCurrencies } = req.body;

        const botFilePath = path.relative(__dirname, botFile.path);
        const imageFilePath = path.relative(__dirname, imageFile.path);
        const backtestImagePath = path.relative(__dirname, backtestImageFile.path);
        const backtestHtmlPath = path.relative(__dirname, backtestHtmlFile.path); // Path for the backtestHtml file

        console.log(JSON.parse(selectedCurrencies));
        // Start database transaction
        db.beginTransaction((transactionErr) => {
            if (transactionErr) {
                return res.status(500).json({ message: "Error starting transaction", error: transactionErr.message });
            }

            // Insert bot into database with the path for the backtest image
            const insertQuery = `
            INSERT INTO bots (name, description, bot_path, image_path, backtest_image_path, backtest_html_path)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [name, description, botFilePath, imageFilePath, backtestImagePath, backtestHtmlPath], (insertErr, insertResult) => {
                if (insertErr) {
                    db.rollback(() => {
                        console.error("Database insert error:", insertErr);
                        return res.status(500).send("Internal Server Error when inserting bot, images.");
                    });
                    return;
                }

                const botId = insertResult.insertId;
                console.log(botId)
                const currenciesInsertQuery = 'INSERT INTO bot_currencies (bot_id, currency_id) VALUES ?';
                const currenciesValues = JSON.parse(selectedCurrencies).map(currencyId => [botId, currencyId]);
                console.log(currenciesValues)
                db.query(currenciesInsertQuery, [currenciesValues], (currenciesErr, currenciesResult) => {
                    if (currenciesErr) {
                        db.rollback(() => {
                            console.error('Error inserting bot-currency relationship:', currenciesErr);
                            return res.status(500).json({ message: "Failed to associate bot with currencies" });
                        });
                        return;
                    }

                    db.commit((commitErr) => {
                        if (commitErr) {
                            db.rollback(() => {
                                console.error('Error committing transaction:', commitErr);
                                return res.status(500).send('Failed to commit transaction');
                            });
                            return;
                        }

                        res.json({
                            success: true,
                            message: "Bot, images, and currency associations uploaded successfully",
                            botFilePath: botFilePath,
                            imageFilePath: imageFilePath,
                            backtestImagePath: backtestImagePath, // Include backtest image path in response
                            botId: botId
                        });
                    });
                });
            });
        });
    });
};

    
const CurrencyUploadHandler = (req, res) => {
    uploadCurrencyImage(req, res, (error) => {
      if (error) {
        return res.status(500).json({ message: "Error uploading image", error: error.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
      }
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Currency name is required." });
      }
  
      const checkSql = "SELECT COUNT(*) AS count FROM currencies WHERE name = ?";
      db.query(checkSql, [name], (checkErr, checkResults) => {
        if (checkErr) {
          console.error('Database check error:', checkErr);
          return res.status(500).json({ message: "Error checking for existing currency name" });
        }
        if (checkResults[0].count > 0) {
          return res.status(409).json({ message: "Currency name already exists" });
        }
  
        const pythonProcess = spawn('python', ['./python/train_model.py',name, new Date().toISOString().split('T')[0]]);
        let outputData = '';
          pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
          });

          pythonProcess.on('close', (code) => {
            if (code !== 0) {
              return res.status(500).json({ message: "Failed to execute Python script" });
            }
            
            // Search for MSE in the output
            const mseMatch = outputData.match(/MSE:(\d+\.\d+)/); // Adjust regex as necessary
            let mse = null;
            if (mseMatch && mseMatch.length > 1) {
              mse = parseFloat(mseMatch[1]);
              console.log("MSE:", mse); // For debugging, or use/store it as needed
            }
          const imageFilePath = path.relative(__dirname, req.file.path);
          const currentDate = new Date().toISOString().split('T')[0];
          const insertSql = "INSERT INTO currencies (name, imagePath, dateAdded, mse) VALUES (?, ?, ?, ?)"; // Assume you've added a 'mse' column to your table
  db.query(insertSql, [name, imageFilePath, currentDate, mse], (insertErr, insertResult) => {
    if (insertErr) {
      console.error('Database insert error:', insertErr);
      return res.status(500).json({ message: "Failed to add currency" });
    }
    res.json({ message: "Currency added successfully, Python script executed, and MSE captured." });
  });
});
      });
    });
};

const changeBacketestHTML = (req, res) => {
    const { backtestHtmlPath, backtestImagePath, URL } = req.body;
  
    // Assuming these paths are relative to your server's public directory
    const htmlFilePath = path.join(__dirname, '../public', backtestHtmlPath);
    const imageFilePath = path.join(__dirname, '../public', backtestImagePath);
  
    fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        return res.status(500).send('Failed to load backtest HTML');
      }
      // Replace image src with the new path
      const updatedHtmlData = htmlData.replace(/src="[^"]+"/g, `src="${URL}/${backtestImagePath}"`);

      // Overwrite the original file
      fs.writeFile(htmlFilePath, updatedHtmlData, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing modified HTML file:', writeErr);
          return res.status(500).send('Failed to process backtest HTML');
        }
  
        // Respond with the URL to the modified (now overwritten) HTML
        const modifiedHtmlUrl = `${URL}/${backtestHtmlPath}`;
        res.json({ modifiedHtmlUrl });
      });
    });
}

      

// Export handlers
module.exports = {
    uploadSlipHandler,
    uploadPortHandler,
    botAndImageUploadHandler,
    CurrencyUploadHandler,
    changeBacketestHTML
    
};
