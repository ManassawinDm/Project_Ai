const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost', // This is typically 'localhost' if your database runs on the same server as your Node app
  user: 'root', // Your database username
  password: '', // Your database password
  database: 'tradingbot' // The name of the database you want to connect to
});

// Connect to the database
db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = db;
