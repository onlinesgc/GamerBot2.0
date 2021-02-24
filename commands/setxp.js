const { fetchProfile } = require("../models/profileSchema");
const Discord = require("discord.js");

module.exports = {
  name: "setxp",
  description: "Set xp for specified user!",
  perms: ["adminCmd"],
  /**
   *
   * @param {Discord.Message} message
   * @param {String[]} args
   */
  async do(message, args) {
    if (!message.mentions.members.first()) {
      return message.channel.send(
        "Du måste ange vilken användare du vill sätta xp'n för."
      );
    }
    if (!args[1]) {
      return message.channel.send(
        "Du måste ange hur mycket xp du vill sätta för användaren!"
      );
    }
    if (isNaN(args[1])) {
      return message.channel.send("Xp-värdet måste vara ett nummer!");
    }

    let profile_data = await fetchProfile(
      message.mentions.members.first().id,
      message.guild.id
    );

    profile_data.xp = args[1];
    profile_data.save();
    const embed = new Discord.MessageEmbed()
      .setColor("#f54242")
      .setTitle(`Set xp`)
      .setDescription(
        `Set ${message.mentions.members.first()}'s xp to ${profile_data.xp}!`
      );
    message.channel.send(embed);
  },
};
