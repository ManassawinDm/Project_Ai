const authRouter = require('./routes/auth.js');
const usersRouter = require('./routes/users.js');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const app = express();  
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../frontend/public/uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })

  

const upload = multer({storage})
const uploadBot = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../api/public/bot");
    }
  }) 
});


app.post('/api/upload', upload.single('slip'), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename)
  })
  
  
  app.post('/api/uploadBot', uploadBot.single('bot'), function (req, res) {
    const file = req.file;
    const name = req.body.name;
    if (file && name) {
      const newFilename = `${name}.${file.originalname.split('.').pop()}`;
      const oldPath = file.path;
      const newPath = path.join("../api/public/bot", newFilename);
  
      // Rename the file
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error renaming the file" });
        }
        res.status(200).json({ filename: newFilename });
      });
    } else {
      res.status(400).json({ error: "File upload failed" });
    }
  });


app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
app.use('/download', express.static('../api/public/bot'));

app.listen(8800, () => {
    console.log("Connected on port 8800");
});
