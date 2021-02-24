const { fetchProfileFromMessage } = require("../../models/profileSchema");
const { prefix } = require("../../config.json");
const { Message, Client } = require("discord.js");

module.exports = {
  name: "message",
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async do(message, client) {
    if (message.author.bot) return;

    // Increase user xp when they type in chat.
    let profile_data = await fetchProfileFromMessage(message);
    profile_data.xp++;
    profile_data.save();

    // If the message starts with the command prefix then try to execute that command
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    if (client.commands.has(cmd)) {
      let command = client.commands.get(cmd);
      // If it's an admin only command and the user doesn't have admin privilages then bail
      if (
        command.perms.includes("adminCmd") &&
        !message.member.hasPermission("ADMINISTRATOR")
      )
        return;
      try {
        client.commands.get(cmd).do(message, args);
      } catch (err) {
        client.emit("error", err);
        message.reply("There was an error trying to execute that command!");
      }
    } else {
      message.reply(`No such command exists`);
    }
  },
};
