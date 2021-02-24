module.exports = {
  name: "warn",
  /**
   * @param {String} message
   * @param {Client} client
   */
  do(message, client) {
    console.warn(message);
  },
};
