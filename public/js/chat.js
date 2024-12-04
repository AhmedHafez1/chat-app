const socket = io();

// Elements
const form$ = document.querySelector('#chat');
const formInput$ = document.querySelector('#text-input');
const formSendButton$ = document.querySelector('#send-btn');
const sendLocationButton$ = document.querySelector('#location-btn');
const messages$ = document.querySelector('#messages');
const sidebar$ = document.querySelector('#sidebar');

// Templates
const messageTemplate$ = document.querySelector('#message-template').innerHTML;
const locationTemplate$ =
  document.querySelector('#location-template').innerHTML;
const sidebarTemplate$ = document.querySelector('#sidebar-template').innerHTML;

// Query strings
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  // New message element
  const $newMessage = messages$.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle(newMessage$);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages$.offsetHeight;

  // Height of messages container
  const containerHeight = messages$.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messages$.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages$.scrollTop = messages$.scrollHeight;
  }
};

socket.on('message', (message) => {
  const messageHtml = Mustache.render(messageTemplate$, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm:ss A'),
  });
  messages$.insertAdjacentHTML('beforeend', messageHtml);

  autoScroll();
});

socket.on('locationMessage', (message) => {
  const locationHtml = Mustache.render(locationTemplate$, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm:ss A'),
  });
  messages$.insertAdjacentHTML('beforeend', locationHtml);

  autoScroll();
});

socket.on('roomData', ({ room, users }) => {
  const sidebarHtml = Mustache.render(sidebarTemplate$, {
    room,
    users,
  });

  sidebar$.innerHTML = sidebarHtml;
});

form$.addEventListener('submit', function (e) {
  e.preventDefault();

  formSendButton$.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('newMessage', message, () => {
    formSendButton$.removeAttribute('disabled');
    formInput$.value = '';
    formInput$.focus();
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
      }
    );
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
