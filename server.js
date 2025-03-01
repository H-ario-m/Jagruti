const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(express.json());
app.use(cors());

const accountSid = 'ACc8ccaedc1b39674d68bc836bbdc8d25e';
const authToken = '6df9802b7fc2e5c5e856dd847e38378e';
const client = twilio(accountSid, authToken);

app.post('/send-sms', (req, res) => {
    const { message, to } = req.body;

    client.messages
        .create({
            body: 'help i am in danger',
            from: '+18646616397',  // Your Twilio phone number
            to: '+7679501321'                 // Recipient's phone number
        })
        .then(message => {
            console.log('SMS Sent:', message.sid);
            res.json({ success: true, messageSid: message.sid });
        })
        .catch(error => {
            console.error('Error sending SMS:', error);
            res.status(500).json({ success: false, error: error.message });
        });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
