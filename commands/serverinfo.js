const Discord = require("discord.js");

module.exports = {
  name: "serverinfo",
  description: "Print server information!",
  perms: [],
  async do(message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Serverinfo - ${message.guild.name}`)
      .setImage(message.guild.iconURL())
      .addFields({ name: "Medlemmar", value: message.guild.memberCount });
    message.channel.send(embed);
  },
};
