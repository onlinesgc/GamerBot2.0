const profileModel = require("../models/profileSchema");
const functions = require("../functions")

module.exports = {
	name: "memberinfo",
	aliases: [],
	description: "Get member information for specified user!",
	usage: [],
	perms: [],
	async do(client, message, args, Discord) {
		if (!message.mentions.members.first()) {
			return message.channel.send("Du måste ange vilken användare du vill veta mer information om!")
		}

		let profile_data = await profileModel.fetchProfileFromMessage(message);		//Fetch profile

		let fields = [
			{ name: "XP", value: profile_data.xp, inline: true }
		];
		if (profile_data.xpTimeoutUntil - message.createdTimestamp > 0) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profile_data.xpTimeoutUntil - message.createdTimestamp), inline: true });
		}

		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Information om medlem`)
			.setDescription(`${message.mentions.members.first()}'s information.`)
			.setImage(message.mentions.users.first().avatarURL())
			.addFields(
				fields,
				{ name: "id", value: profile_data.userID }
			)
		message.channel.send(embed);
	}
}