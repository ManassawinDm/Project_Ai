const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth'); 
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/file');
const botRoutes = require('./routes/bot');
const adminRouter = require('./routes/admin.js');
const omiseRouter = require('./routes/omise.js');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/file', fileRoutes); 
app.use('/api/bot',botRoutes)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/admin', adminRouter);
app.use('/api/omise', omiseRouter);



app.listen(process.env.PORT, () => {
    console.log("Server running on port 8112");
});
