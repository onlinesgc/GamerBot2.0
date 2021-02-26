const profileModel = require("../models/profileSchema");

module.exports = {
	name: "memberinfo",
	aliases: [],
	description: "Get member information for specified user!",
	perms: [],
	async do(client, message, args, Discord) {
		if (!message.mentions.members.first()) {
			return message.channel.send("Du måste ange vilken användare du vill veta mer information om!")
		}

		profile_data = await profileModel.findOne({ userID: message.mentions.members.first().id })
		if (!profile_data) {
			let profile = await profileModel.create({
				userID: message.mentions.members.first().id,
				serverID: message.guild.id,
				xp: 0,
				lastMessageTimestamp: null,
				xpTimeoutUntil: null
			});
			profile.save();
		}

		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Information om medlem`)
			.setDescription(`${message.mentions.members.first()}'s information.`)
			.setImage(message.mentions.users.first().avatarURL())
			.addFields(
				{ name: "XP", value: profile_data.xp },
				{ name: "id", value: profile_data.userID }
			)
		message.channel.send(embed);
	}
}