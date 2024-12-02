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

document.querySelector('#send-location').addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!');
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});
