const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const { getMessage, getLocationMessage } = require('./utils/messages');
const { addUser, removeUser } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New Web Socket Connection!');

  socket.on('join', ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', getMessage('Welcome!'));
    socket.broadcast
      .to(user.room)
      .emit('message', getMessage(user.username + ' has joined!'));

    callback();
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
    const [user] = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        getMessage(user.username + ' has left!')
      );
    }
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}!`));
