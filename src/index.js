const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
  console.log('New Web Socket Connection!');
  socket.emit('countUpdated', count);
  socket.on('increment', () => {
    count++;
    io.emit('countUpdated', count);
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}!`));
