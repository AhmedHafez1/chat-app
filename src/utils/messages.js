const getMessage = (message) => {
  return {
    text: message,
    createdAt: new Date().toISOString(),
  };
};

module.exports = {
  getMessage,
};
