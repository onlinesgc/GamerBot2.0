const Discord = require("discord.js");

module.exports = {
  name: "ping",
  aliases: [],
  description: "Ping the bot!",
  perms: [],
  async do(message, args) {
    const pinging_embed = new Discord.MessageEmbed()
      .setColor("#f54242")
      .setTitle(`Pinging`)
      .setDescription(`Pinging...`);
    var botMessage = await message.channel.send(pinging_embed);
    const pong_embed = new Discord.MessageEmbed()
      .setColor("#f54242")
      .setTitle(`:ping_pong:  Pong`)
      .setDescription(
        `Took ${botMessage.createdTimestamp - message.createdTimestamp} ms!`
      );
    message.channel.send(pong_embed);
  },
};