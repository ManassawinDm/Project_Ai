const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const selectQuery = "SELECT * FROM account WHERE email = ?";
  db.query(selectQuery, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    bcrypt.hash(req.body.password, 10, (hashErr, hashedPassword) => {
      if (hashErr) return res.json(hashErr);
      const checkPortQuery = "SELECT * FROM Ports WHERE port_number = ?";
      db.query(checkPortQuery, [req.body.portnumber], (checkPortErr, portData) => {
        if (checkPortErr) return res.status(500).json(checkPortErr);
        if (portData.length) return res.status(409).json("Port number already exists!");

        const insertAccountQuery = "INSERT INTO account (email, password, role) VALUES (?, ?, ?)";
        const accountValues = [req.body.email, hashedPassword, "user"];
      
        db.query(insertAccountQuery, accountValues, (insertAccountErr, accountResult) => {
          if (insertAccountErr) return res.json(insertAccountErr);

          const accountId = accountResult.insertId;
          
          const insertPortNumberQuery = "INSERT INTO Ports (account_id, port_number) VALUES (?, ?)";
          const portNumberValues = [accountId, req.body.portnumber];

          db.query(insertPortNumberQuery, portNumberValues, (insertPortNumberErr, portNumberResult) => {
            if (insertPortNumberErr) return res.json(insertPortNumberErr);


            res.status(200).json("User, port number, and transaction have been created.");
            
            const insertTransactionQuery = "INSERT INTO transaction (account_id,date) VALUES (?, NOW())";
            // db.query(insertTransactionQuery, [accountId], (insertTransactionErr, transactionResult) => {
            //   if (insertTransactionErr) return res.json(insertTransactionErr);
              
            //   res.status(200).json("User, port number, and transaction have been created.");
            // });
          });
        });
      });
    });
  });
};






const login = (req, res) => {
  const q = "SELECT * FROM account WHERE email = ?";
  // console.log("this functino is done")
  db.query(q, [req.body.email], async (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    const user = data[0];
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    // console.log(passwordMatch)
    if (!passwordMatch) {
      return res.status(400).json("Wrong username or password");
    }
    // console.log(user)

    const role = user.role
    const token = jwt.sign({id: user.account_id, email: user.email, role: user.role}, "jwtkey", { expiresIn: "1h" });
    // const decoded = jwt.decode(token);
    // console.log(decoded);
    res.cookie("access_token", token);

    const { password, ...userDataWithoutPassword } = user;

    //console.log("Cookie 'access_token' set with token:", token);
    res.status(200).json({token : token , email : req.body.email,role:role});

  });
};



const logout = (req, res) => {
  res.cookie('access_token', '', { expires: new Date(0) });
  
  console.log('Access token cookie cleared.');
  res.status(200).json({ message: 'Logged out successfully' });
};


const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.sendStatus(401); 
  }

  jwt.verify(token, "jwtkey", (err, user) => {
    if (err) {
      return res.sendStatus(403); 
    }

    // console.log(user)
    req.user = user;
    next();
  });
};


module.exports = {
  register,
  login,
  logout,
  authenticateToken,
};
