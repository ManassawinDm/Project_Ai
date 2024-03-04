const jwt = require('jsonwebtoken');
const db = require("../db.js");


const fetchUserData = (req, res) => {

    const userEmail = req.user.email;

    db.query("SELECT email, port_number FROM account LEFT JOIN Ports ON Ports.account_id = account.Account_ID WHERE email = ?", [userEmail], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database query error", error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = { email: result[0].email, port_numbers: result.map(row => row.port_number) };

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
            res.json({ message: 'New port number added successfully', portNumber: portNumber });
        });
    });
};

const validateAccount = (req, res) => {
    const { AccountNumber} = req.body;
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
            console.log("Found ", result);
            res.json({ isValid: true, status : true });
        } else {
            res.json({ isValid: true, status : false , message: 'Account number not found' });
        }
    });

};

const Commission = (req, res) => {
    const { AccountNumber, weeklyProfit, Date } = req.body;
    
    console.log("Received AccountNumber:", AccountNumber);
    console.log("Received weeklyProfit:", weeklyProfit);
    console.log("Received date:", Date);

    const query = "SELECT * FROM ports WHERE port_number = ?";

    db.query(query, [AccountNumber], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: 'Database query error', error: err });
        }

        if (result.length > 0) {
            console.log("Found port with AccountNumber:", AccountNumber, "Result:", result);
            const portId = result[0].port_id; // Assuming port_id is the identifier in your ports table
            const commission = weeklyProfit * 0.03;
            const insertTransaction = `
                INSERT INTO Transaction (Date, Profit, Commission, Status, port_id) 
                VALUES (?, ?, ?, ?, ?)
            `;
            // Execute the insert query
            db.query(insertTransaction, [Date, weeklyProfit, commission, 0, portId], (insertErr, insertResult) => {
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






module.exports = { fetchUserData, addNewPort, validateAccount ,Commission};
