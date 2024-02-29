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


module.exports = { fetchUserData, addNewPort };
