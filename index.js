// index.js
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const fs = require('fs');


const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'dashboard.html'));
});

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for location updates from the client
  socket.on('location', (data) => {
    console.log('Location update:', data);
    // Here you could broadcast the location to other connected clients if needed.
  });

  // Listen for recording data (e.g. the blob) from the client
  socket.on('recording', (data) => {
    console.log('Recording received');
    // Save the recording data to a file
    const fileName = `recording_${Date.now()}.webm`;
    fs.writeFile(fileName, data.data, (err) => {
      if (err) {
        console.error("Error saving recording:", err);
      } else {
        console.log(`Recording saved as ${fileName}`);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
