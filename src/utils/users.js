const users = new Map();

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
  const key = `${username}_${room}`;
  if (users.has(key)) {
    return {
      error: 'There is already a user with the same name in the room!',
    };
  }

  // Store user
  const user = { id, username, room };
  users.set(key, user);
  return { user };
};

const removeUser = ({ username, room }) => {
  users.delete(`${username}_${room}`);
};
