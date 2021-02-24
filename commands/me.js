const Discord = require("discord.js");
const { fetchProfileFromMessage } = require("../models/profileSchema");

module.exports = {
  name: "me",
  aliases: ["myinfo"],
  description: "Print information about user!",
  perms: [],
  /**
   *
   * @param {Discord.Message} message
   * @param {String[]} args
   */
  async do(message, args) {
    let profile_data = await fetchProfileFromMessage(message);

    const embed = new Discord.MessageEmbed()
      .setColor("#f54242")
      .setTitle(`User info`)
      .setDescription(`${message.member}'s user information.`)
      .addFields({ name: "XP", value: profile_data.xp });
    message.channel.send(embed);
  },
};
