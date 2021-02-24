const { fetchProfile } = require("../models/profileSchema");
const { MessageEmbed, Message } = require("discord.js");

module.exports = {
  name: "memberinfo",
  description: "Get member information for specified user!",
  perms: [],
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   */
  async do(message, args) {
    if (!message.mentions.members.first()) {
      return message.channel.send(
        "Du måste ange vilken användare du vill veta mer information om!"
      );
    }

    let profile_data = await fetchProfile(message.author.id, message.guild.id);

    const embed = new MessageEmbed()
      .setColor("#f54242")
      .setTitle(`Information om medlem`)
      .setDescription(`${message.mentions.members.first()}'s information.`)
      .addFields(
        { name: "XP", value: profile_data.xp },
        { name: "id", value: profile_data.userID }
      );
    message.channel.send(embed);
  },
};
