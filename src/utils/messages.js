const getMessage = (message) => {
  return {
    text: message,
    createdAt: new Date().toISOString(),
  };
};

const getLocationMessage = (latitude, longitude) => {
  return {
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().toISOString(),
  };
};

module.exports = {
  getMessage,
  getLocationMessage,
};
