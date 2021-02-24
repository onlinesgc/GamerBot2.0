module.exports = {
  name: "error",
  /**
   * @param {String} message
   * @param {Client} client
   */
  do(message, client) {
    console.error(message);
  },
};
