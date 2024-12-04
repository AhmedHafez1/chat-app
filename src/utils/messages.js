const getMessage = (username, message) => {
  return {
    username,
    text: message,
    createdAt: new Date().toISOString(),
  };
};

const getLocationMessage = (username, latitude, longitude) => {
  return {
    username,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().toISOString(),
  };
};

module.exports = {
  getMessage,
  getLocationMessage,
};
