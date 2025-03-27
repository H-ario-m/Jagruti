const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = 'AC12c91d38983e426086073c2e5c5e8589';
const authToken = 'f3a911808a82f862742c9256a5d30229';
const client = twilio(accountSid, authToken);



app.post('/send-sms', async (req, res) => {
    console.log('Received request:', req.body);
    try {
      const message = await client.messages.create({
        body: req.body.message,
        from: '+19083865506',
        to: req.body.to
      });
      console.log('Twilio response:', message);
      res.json({ success: true, sid: message.sid });
    } catch (error) {
      console.error('Full error object:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        code: error.code  // Add Twilio error code
      });
    }
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));