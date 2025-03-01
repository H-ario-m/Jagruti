// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const multer  = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure your Nodemailer transporter (example uses Ethereal Email)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // use TLS for port 587
  auth: {
    user: 'YOUR_ETHEREAL_USER@ethereal.email', // replace with your Ethereal user
    pass: 'YOUR_ETHEREAL_PASSWORD'              // replace with your Ethereal password
  }
});

// Endpoint to receive the recorded file and location and send email
app.post('/send-email', upload.single('recordedFile'), async (req, res) => {
  try {
    const location = req.body.location; // Should be a Google Maps URL
    const file = req.file; // Uploaded file

    let mailOptions = {
      from: '"Anshuman" <anshumanojha91@gmail.com>',
      to: 'anshuman.p24@medhaviskillsuniversity.edu.in',  // Replace with the recipient's email
      subject: 'Recorded File & Location Data',
      text: `Location: ${location}`,
      html: `<p>Location: <a href="${location}">${location}</a></p>`,
      attachments: []
    };

    if (file) {
      mailOptions.attachments.push({
        filename: file.originalname || 'recording.webm',
        path: file.path
      });
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
