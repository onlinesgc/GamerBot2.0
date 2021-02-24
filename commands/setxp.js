const profileModel = require("../models/profileSchema");

module.exports = {
	name: "setxp",
	aliases: [],
	description: "Set xp for specified user!",
	perms: ["adminCmd"],
	async do(client, message, args, Discord) {
		if (!message.mentions.members.first()) {
			return message.channel.send("Du måste ange vilken användare du vill sätta xp'n för.")
		}
		if (!args[1]) {
			return message.channel.send("Du måste ange hur mycket xp du vill sätta för användaren!")
		}
		if (isNaN(args[1])) {
			return message.channel.send("Xp-värdet måste vara ett nummer!");
		}
		
		profile_data = await profileModel.findOne({ userID: message.mentions.members.first().id })
		if (!profile_data) {
			let profile = await profileModel.create({
				userID: message.mentions.members.first().id,
				serverID: message.guild.id,
				xp: 0
			});
			profile.save();
		}
		
		profile_data.xp = args[1];
		profile_data.save();
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Set xp`)
			.setDescription(`Set ${message.mentions.members.first()}'s xp to ${profile_data.xp}!`)
		message.channel.send(embed);
	}
}