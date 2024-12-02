const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#chat').addEventListener('submit', function (e) {
  e.preventDefault();

  const input = e.target.elements.message.value;

  if (input.trim() === '') {
    alert('Please enter something!');
    return;
  }

  socket.emit('newMessage', input);
});
