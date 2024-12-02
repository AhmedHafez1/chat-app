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

io.on('connection', (socket) => {
  console.log('New Web Socket Connection!');

  socket.emit('message', 'Welcome!');
  socket.broadcast.emit('message', 'A new user has joined!');

  socket.on('newMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('sendLocation', ({ latitude, longitude }) => {
    socket.broadcast.emit(
      'message',
      `https://www.google.com/maps?q=${latitude},${longitude}`
    );
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}!`));
