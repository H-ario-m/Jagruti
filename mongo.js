const express = require('express');
const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
require('dotenv').config();

const upload = multer(); // Middleware for file uploads
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  console.log('Request Headers:', req.headers);
  next();
});

const mongoURI = process.env.MONGO_URI || "mongodb+srv://anshuman:anshuman@cluster0.3tm7y.mongodb.net/myVirtualDatabase?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let bucket;

client.connect()
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    const db = client.db('myVirtualDatabase');
    bucket = new GridFSBucket(db, { bucketName: 'recordings' });

    // File upload endpoint
    app.post('/upload', upload.single('file'), (req, res) => {
      console.log('Request File:', req.file); // Log the uploaded file
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype
      });

      uploadStream.write(req.file.buffer);
      uploadStream.end();

      uploadStream.on('finish', (fileData) => {
        console.log('File stored in GridFS:', fileData);
        res.status(200).send({ message: 'File uploaded successfully!', fileId: fileData._id });
      });

      uploadStream.on('error', (error) => {
        console.error('Error uploading file:', error);
        res.status(500).send({ message: 'Error uploading file', error });
      });
    });

    // Test endpoint
    app.post('/abc', (req, res) => {
      console.log('Request Body:', req.body);
      res.json({ message: 'POST request to /abc handled successfully!' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });