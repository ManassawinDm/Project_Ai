const cron = require('node-cron');
const { spawn } = require('child_process');
const db = require('./db');

function runPythonScript(yfinanceIdentifier, name) {
    return new Promise((resolve, reject) => {
      const currentDate = new Date().toISOString().split('T')[0];
      const pythonProcess = spawn('python', ['./python/train_model.py', yfinanceIdentifier, currentDate, name]);
  
      pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
  
      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
  
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}`));
        } else {
          console.log(`Python script completed successfully.`);
          resolve();
        }
      });
    });
  }
  
  async function checkCurrencyAndUpdate() {
    db.query('SELECT * FROM currencies WHERE DATEDIFF(NOW(), dateAdded) > 3', async (err, currencies) => {
      if (err) {
        console.error('Error fetching currencies from database:', err);
        return;
      }
      console.log(currencies)
      for (const currency of currencies) {
        try {
          await runPythonScript(currency.yfinanceIdentifier, currency.name);
          db.query('UPDATE currencies SET dateAdded = NOW() WHERE id = ?', [currency.id], (updateErr) => {
            if (updateErr) {
              console.error(`Error updating dateAdded for currency ID ${currency.id}:`, updateErr);
            } else {
              console.log(`Updated dateAdded for currency ID ${currency.id}`);
            }
          });
        } catch (error) {
          console.error(`Failed to run script for currency ID ${currency.id}:`, error);
        }
      }
    });
  }

  cron.schedule('0 18 * * *', () => {
    console.log('Running daily check on currency entries at 18:00...');
    checkCurrencyAndUpdate();
  });