const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Enable CORS
app.use(cors());

// Serve static files from 'public' and 'uploads' directories
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('File uploaded:', req.file); // Log the uploaded file details
  res.send({ imagePath: `/uploads/${req.file.filename}` });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
