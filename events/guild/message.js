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

    const command =
      client.commands.get(cmd) ||
      client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

    if (command) {
      // If it's an admin only command and the user doesn't have admin privilages then bail
      if (
        command.perms.includes("adminCmd") &&
        !message.member.hasPermission("ADMINISTRATOR")
      )
        return;
      try {
        command.do(message, args);
      } catch (err) {
        client.emit("error", err);
        message.reply("There was an error trying to execute that command!");
      }
    } else {
      message.reply(`No such command exists`);
    }

    if (message.channel.id == "809393742637170708") {
      message.react("✅");
      message.react("❌");
    }

    if (message.content.toLowerCase().replace(/\s/g, "").includes("gaming")) {
      if (
        message.channel.id == "809483972282810390" ||
        message.channel.id == "780765093343395880"
      ) {
        if (Math.floor(Math.random() * 100) > 86) {
          message.channel.send("**GAMING! 🎮**");
        }
      }
    }
    if (
      message.content.toLowerCase().includes("christerpog") ||
      message.content.toLowerCase().includes("cristerpog")
    ) {
      if (
        message.channel.id == "809483972282810390" ||
        message.channel.id == "780765093343395880"
      ) {
        message.react("810255466952917052");
        message.channel.send("<:mello_ChristerPOG:810255466952917052>");
      }
    }
    if (
      message.content.toLowerCase().includes("hur mycket är klockan") ||
      message.content.toLowerCase().includes("vad är klockan")
    ) {
      if (Math.floor(Math.random() * 100) > 91) {
        message.channel.send("**KLOCKAN TOLV!**");
      } else {
        var currentdate = new Date();
        var datetime =
          ("0" + currentdate.getHours()).slice(-2) +
          ":" +
          ("0" + currentdate.getMinutes()).slice(-2) +
          ":" +
          ("0" + currentdate.getSeconds()).slice(-2);
        message.channel.send(`Klockan är ${datetime}`);
      }
    }
  },
};
