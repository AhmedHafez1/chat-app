const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const { getMessage, getLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New Web Socket Connection!');

  socket.on('join', ({ username, room }) => {
    socket.join(room);

    socket.emit('message', getMessage('Welcome!'));
    socket.broadcast
      .to(room)
      .emit('message', getMessage('A new user has joined!'));
  });

  socket.on('newMessage', (message, callback) => {
    io.emit('message', getMessage(message));
    callback();
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    io.emit('locationMessage', getLocationMessage(latitude, longitude));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', getMessage('A user has left!'));
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}!`));
