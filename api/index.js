const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../frontend/public/uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })

const upload = multer({storage})
const app = express();  
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.post('/api/upload', upload.single('slip'), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename)
  })

app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);

app.listen(8800, () => {
    console.log("Connected on port 8800");
});
