const socket = io();

// Elements
const form$ = document.querySelector('#chat');
const formInput$ = document.querySelector('#text-input');
const formSendButton$ = document.querySelector('#send-btn');
const sendLocationButton$ = document.querySelector('#location-btn');
const messages$ = document.querySelector('#messages');

// Templates
const messageTemplate$ = document.querySelector('#message-template').innerHTML;
const locationTemplate$ =
  document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
  const messageHtml = Mustache.render(messageTemplate$, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm:ss A'),
  });
  messages$.insertAdjacentHTML('beforeend', messageHtml);
});

socket.on('locationMessage', (message) => {
  const locationHtml = Mustache.render(locationTemplate$, {
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm:ss A'),
  });
  messages$.insertAdjacentHTML('beforeend', locationHtml);
});

form$.addEventListener('submit', function (e) {
  e.preventDefault();

  formSendButton$.setAttribute('disabled', 'disabled');

  const input = e.target.elements.message.value;

  if (input.trim() === '') {
    alert('Please enter something!');
    formSendButton$.removeAttribute('disabled');
    return;
  }

  socket.emit('newMessage', input, () => {
    formSendButton$.removeAttribute('disabled');
    formInput$.value = '';
    formInput$.focus();

    console.log('Message delivered!');
  });
});

sendLocationButton$.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!');
  }

  sendLocationButton$.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        sendLocationButton$.removeAttribute('disabled');
        console.log('Location shared!');
      }
    );
  });
});
