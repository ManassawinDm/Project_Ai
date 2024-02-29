const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();  
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);

app.listen(8800, () => {
    console.log("Connected on port 8800");
});
