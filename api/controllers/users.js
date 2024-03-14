const jwt = require('jsonwebtoken');
const db = require("../db.js");
const fetch = require('node-fetch');


const fetchUserData = (req, res) => {
    const userEmail = req.user.email;

    // Modified query to join with the transaction table, group by port_id, and sum the commissions
    const query = `
        SELECT 
            a.email, 
            p.port_number,
            p.status,
            p.port_id,
            IFNULL(SUM(t.Commission), 0) AS total_commission
        FROM 
            account a
        LEFT JOIN 
            ports p ON a.Account_ID = p.account_id
        LEFT JOIN 
            transaction t ON p.port_id = t.port_id
        WHERE 
            a.email = ?
        GROUP BY 
            p.port_id
    `;

    db.query(query, [userEmail], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database query error", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Map over results to structure the ports data including total commissions
        const portsData = results.map(row => ({
            port_number: row.port_number,
            status: row.status,
            total_commission: row.total_commission,
            port_id : row.port_id
        }));

        // Construct user data object including ports data with commissions
        const userData = {
            email: userEmail,
            ports: portsData // This includes port numbers with their statuses and total commissions
        };

        res.json({ userData: userData });
    });
};

const addNewPort = (req, res) => {

    const { portNumber } = req.body;
    const userId = req.user.id;
    // console.log( req.user.id)
    // console.log(userId)

    if (!portNumber) {
        return res.status(400).json({ message: 'Port number is required' });
    }

    // console.log(userId)
    const checkQuery = 'SELECT * FROM Ports WHERE port_number = ?';

    db.query(checkQuery, [portNumber], (checkErr, checkResult) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: 'Error checking for existing port number' });
        }

        if (checkResult.length > 0) {
            return res.status(409).json({ message: 'Port number already exists' });
        }
        const query = 'INSERT INTO Ports (account_id, port_number) VALUES (?, ?)';
        db.query(query, [userId, portNumber], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Failed to add new port number' });
            }
            const portId = result.insertId; // Get the inserted port ID

            res.json({
                message: 'New port number added successfully',
                portNumber: portNumber,
                portId: portId  // Include portId in the response
            });
        });
    });
};

const validateAccount = (req, res) => {
    const { AccountNumber } = req.body;
    console.log(`Received data: AccountNumber: ${AccountNumber}`);

    if (!AccountNumber) {
        return res.status(400).json({ message: 'Account number is required' });
    }

    const query = "SELECT * FROM ports WHERE port_number = ?";

    db.query(query, [AccountNumber], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database query error' });
        }

        if (result.length > 0) {
            // console.log("Found port: ", result);
            const portId = result[0].port_id;
            const portStatus = result[0].status; // Assuming the status column exists in your ports table

            // Proceed only if the port's status is verified
            if (portStatus === 1) {
                // Modified query to sum commissions for transactions that are not paid (status != 1)
                const queryGetCommissionSum = "SELECT SUM(Commission) AS TotalCommission FROM transaction WHERE port_id = ? AND status != 1";
                db.query(queryGetCommissionSum, [portId], (sumErr, sumResult) => {
                    if (sumErr) {
                        console.error(sumErr);
                        return res.status(500).json({ message: 'Error calculating commission sum', error: sumErr });
                    }

                    const totalCommission = sumResult[0].TotalCommission || 0;
                    console.log(totalCommission)
                    if (totalCommission <= 300) {
                        res.json({ isValid: true, verify: true, commissionCheck: true });
                    } else {
                        res.json({ isValid: true, verify: true, commissionCheck: false });
                    }
                });
            } else if (portStatus === 0) { // Port is rejected
                res.json({ isValid: true, verify: false, message: 'Wait for admin to verify port' });
            } else { // Port status is unknown or not handled
                res.json({ isValid: true, verify: false, message: 'Port status is unknown' });
            }

        } else {
            res.json({ isValid: false, verify: false, message: 'Port Number not found' });
        }
    });
};

const getUsdToThbRate = async () => {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }
        const data = await response.json();
        const rate = data.rates['THB'];
        return rate;
    } catch (error) {
        console.error('Error fetching USD to THB rate:', error);
        throw error;
    }
};

const Commission = async (req, res) => {
    const { AccountNumber, weeklyProfit, Date } = req.body;

    console.log("Received AccountNumber:", AccountNumber);
    console.log("Received weeklyProfit:", weeklyProfit);
    console.log("Received date:", Date);
    const rate = await getUsdToThbRate();
    const weeklyProfitinThb = weeklyProfit * rate;
    const commissionInThb = weeklyProfit * 0.10 * rate;
    // console.log(weeklyProfit)
    // console.log(commissionInThb)

    const query = "SELECT * FROM ports WHERE port_number = ?";

    db.query(query, [AccountNumber], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: 'Database query error', error: err });
        }

        if (result.length > 0) {
            console.log("Found port with AccountNumber:", AccountNumber, "Result:", result);
            const portId = result[0].port_id;
            const insertTransaction = `
                INSERT INTO Transaction (Date, Profit, Commission, Status, port_id) 
                VALUES (?, ?, ?, ?, ?)
            `;
            // Execute the insert query
            db.query(insertTransaction, [Date, weeklyProfitinThb, commissionInThb, 0, portId], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error("Error inserting transaction:", insertErr);
                    return res.status(500).json({ message: 'Error inserting transaction', error: insertErr });
                }
                console.log("Inserted transaction with ID:", insertResult.insertId);
                res.json({ success: true, message: 'Weekly profit recorded successfully', transactionId: insertResult.insertId });
            });
        } else {
            console.log("No port found for AccountNumber:", AccountNumber);
            res.status(404).json({ success: false, message: 'Port number not found in database' });
        }
    });
};


const getVerificationData = (req, res) => {
    // Make sure to start your query with SELECT
    const query = `
    SELECT
    p.port_id,
    vp.filename, 
    vp.filepath, 
    p.port_number, 
    a.email ,
    p.status,
    vp.id
  FROM 
    verifyport vp
  JOIN 
    ports p ON vp.port_id = p.port_id
  JOIN 
    account a ON p.account_id = a.account_id;
    `;

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Error querying the database', error: error });
        }

        // Process the results as needed before sending them back
        const mappedResults = results
            .filter(row => row.status === 0)
            .map(row => ({
                id: row.port_id,
                filename: row.filename,
                filepath: row.filepath,
                portNumber: row.port_number,
                accountEmail: row.email,
                status: row.status,
                file_id : row.id,
            }));

        res.json(mappedResults);
    });
};

const verifyPort = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;


    db.query('UPDATE ports SET status = ? WHERE port_id = ?', [status, id], (error, results) => {
        if (error) {
            console.error('Error updating status:', error);
            res.status(500).json({ error: 'Error updating status' });
        } else {
            console.log('Status updated successfully');
            res.status(200).json({ message: 'Status updated successfully' });
        }
    });
}

// แก้ให้ลบ database แทน
const rejectPort = async (req, res) => {
    const { id } = req.params;
    const { file_id } = req.body;

    try {
        
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM verifyport WHERE id = ?', [file_id], (error, results) => {
                if (error) {
                    console.error('Error deleting record from verifyport:', error);
                    reject('Error deleting record from verifyport');
                } else {
                    console.log('Record deleted successfully from verifyport');
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            db.query('DELETE FROM ports WHERE port_id = ?', [id], (error, results) => {
                if (error) {
                    console.error('Error deleting port:', error);
                    reject('Error deleting port');
                } else {
                    console.log('Port deleted successfully');
                    resolve();
                }
            });
        });

        res.status(200).json({ message: 'Records deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting records' });
    }
};

const fetchSlip = (req, res) => {
    const q = 'SELECT * FROM slipupload'; 

    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ message: 'Error retrieving slips', error: err });
        const groupedByEmail = data.reduce((acc, current) => {
            (acc[current.email] = acc[current.email] || []).push(current);
            return acc;
        }, {});

        // Convert the groupedByEmail object into an array of objects
        const groupedDataArray = Object.keys(groupedByEmail).map(email => {
            return { email: email, slips: groupedByEmail[email] };
        });

        res.status(200).json({ message: "Fetch successful", data: groupedDataArray });
    });
}

const payCommissions = async (req, res) => {
    const { transactionIds } = req.body; // Array of transaction IDs to mark as paid

    if (!transactionIds || transactionIds.length === 0) {
        return res.status(400).send('No transactions provided.');
    }

    try {
        // Start a new database transaction
        await db.beginTransaction();

        // Construct the SQL query to update the status for all selected transactions
        const updateQuery = `
            UPDATE transaction
            SET status = 1
            WHERE Transaction_ID IN (?) AND status = 0;
        `;

        // Execute the query with the array of transaction IDs
        await db.query(updateQuery, [transactionIds]);

        // If all goes well, commit the transaction
        await db.commit();
        res.send('Commissions paid successfully.');

    } catch (error) {
        // If anything goes wrong, roll back the transaction
        await db.rollback();
        console.error('Error during commission payment:', error);
        res.status(500).send('An error occurred while paying commissions.');
    }
};

const gettransaction = (req, res) => {
    const { portId } = req.params;

    db.query('SELECT * FROM transaction WHERE port_id = ? AND status IN (0, 2)', [portId], (error, rows) => {
        if (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ transactions: rows });
        }
    });
};

const updatetransaction = async (req, res) => {
    // Assume transactionIds is already parsed from JSON string to array
    const transactionIds = JSON.parse(req.body.transactionIds);
    console.log(transactionIds)
    try {
      // Start a transaction if you are updating multiple rows
      await db.beginTransaction();
  
      // Prepare the SQL query
      const updateQuery = 'UPDATE transaction SET status = 3 WHERE Transaction_ID = ?';
  
      // Update each transaction status to 2
      for (const id of transactionIds) {
        await db.query(updateQuery, [id]);
      }
  
      // Commit the transaction
      await db.commit();
  
      res.json({ message: "Transactions Pending successfully." });
    } catch (error) {
      // If an error occurs, rollback any changes
      await db.rollback();
  
      console.error('Error Pending transactions:', error);
      res.status(500).json({ message: 'Failed to Pending transactions' });
    }
  };

  const fetchcurrency =  async (req, res) => {
    try {
        const sql = 'SELECT * FROM currencies'; // Adjust the query to match your database structure
        db.query(sql, (err, results) => {
            if (err) {
                // Handle error after the release
                console.error('Error fetching currencies:', err);
                res.status(500).json({ message: "Internal Server Error" });
            } else {
                // Respond with the list of currencies
                res.json({ currencies: results });
            }
        });
    } catch (error) {
        // Catch and send any other errors
        console.error('Server error:', error);
        res.status(500).send('Server error');
    }
  }

  const fetchhistory = (req, res) => {
    const { portId } = req.params;

    const query = `
        SELECT 
            t.Transaction_ID,
            t.Date,
            t.Profit,
            t.Commission,
            p.port_id,
            t.Status
        FROM 
            transaction t
        JOIN 
            ports p ON t.port_id = p.port_id
        WHERE 
            p.port_number = ?
        ORDER BY 
            t.Date DESC;
    `;

    db.query(query, [portId], (error, transactions) => {
        if (error) {
            console.error('Error fetching transactions:', error);
            return res.status(500).json({ message: 'Error fetching transactions from the database.' });
        }
        res.status(200).json({ transactions });
    });
};




module.exports = { fetchhistory,fetchcurrency,fetchUserData, 
    addNewPort, validateAccount, Commission, getVerificationData, 
    verifyPort, rejectPort , fetchSlip,payCommissions,gettransaction
    ,updatetransaction};
