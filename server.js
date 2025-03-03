const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = 'ACc8ccaedc1b39674d68bc836bbdc8d25e';
const authToken = '6df9802b7fc2e5c5e856dd847e38378e';
const client = twilio(accountSid, authToken);



app.post('/send-sms', async (req, res) => {
    console.log('Received request:', req.body);
    try {
      const message = await client.messages.create({
        body: req.body.message,
        from: '+18646616397',
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