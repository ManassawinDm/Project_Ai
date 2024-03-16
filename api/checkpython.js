const cron = require('node-cron');
const { spawn } = require('child_process');
const db = require('./db');

function runPythonScript(name) {
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const pythonProcess = spawn('python', ['./python/train_model.py', name, currentDate]);

    let stderrData = '';
    let stdoutData = '';

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      stdoutData += data.toString();  // Accumulate the stdout data
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0 || stderrData.includes("Error: No yFinance identifier found for")) {
        reject(new Error(`Failed to execute Python script for ${name}. Error: ${stderrData}`));
      } else {
        console.log(`Python script for ${name} completed successfully.`);
        
        // Extract the MSE from stdoutData
        const mseMatch = stdoutData.match(/MSE:(\d+\.\d+)/);
        if (mseMatch && mseMatch[1]) {
          const mse = parseFloat(mseMatch[1]);
          console.log(`MSE for ${name}: ${mse}`);
          resolve(mse);  // Resolve with MSE
        } else {
          reject(new Error("MSE could not be parsed from Python script output."));
        }
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

    for (const currency of currencies) {
      let mse;
      try {
        mse = await runPythonScript(currency.name);
        console.log(`MSE for ${currency.name}: ${mse}`);
      } catch (error) {
        console.error(`Failed to run script for currency ID ${currency.id}:`, error);
        mse = null; // Assign null or a default value as needed
      }

      // Update the database with the new dateAdded and, if available, the MSE
      db.query('UPDATE currencies SET dateAdded = NOW(), mse = ? WHERE id = ?', [mse, currency.id], (updateErr) => {
        if (updateErr) {
          console.error(`Error updating currency ID ${currency.id}:`, updateErr);
        } else {
          console.log(`Updated currency ID ${currency.id} with new date and MSE`);
        }
      });
    }
  });

}

cron.schedule('* * * * *', () => {
    console.log('RUN DAILY CHECK');
    checkCurrencyAndUpdate();
});
