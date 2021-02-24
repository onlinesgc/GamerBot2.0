module.exports = {
  name: "emujoin",
  description: "Emulate someone joining the guild!",
  perms: ["adminCmd"],
  async do(message, args) {
    message.client.emit("guildMemberAdd", member);
  },
};
