const users = [];

const addUser = ({ id, username, room }) => {
  // Clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate data
  if (!username || !room) {
    return {
      error: 'Username and room are required!',
    };
  }

  // Validate existing user
  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );
  if (existingUser) {
    return {
      error: 'There is already a user with the same name in the room!',
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1);
  }

  return [];
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getRoomUsers = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getRoomUsers,
};
