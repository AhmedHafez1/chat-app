const socket = io();
socket.on('countUpdated', (counter) => {
  console.log('Counter updated : ', counter);
});

document.querySelector('#increment').addEventListener('click', () => {
  socket.emit('increment');
});
