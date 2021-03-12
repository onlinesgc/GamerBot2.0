const functions = require("../functions");
const Discord = require('discord.js');

module.exports = {
	name: "me",
	aliases: ["myinfo"],
	description: "Print information about user!",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
		let fields = [
			{ name: "XP", value: profileData.xp, inline: true }
		];
		if (profileData.xpTimeoutUntil - message.createdTimestamp > 0) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profileData.xpTimeoutUntil - message.createdTimestamp), inline: true });
		}
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Användarinfo`)
			.setDescription(`${message.member}'s information.`)
			.setImage(message.author.avatarURL())
			.addFields(
				fields,
				{ name: "Level", value: profileData.level - 1, inline: true },
				{ name: "id", value: message.author.id }
			)
		message.channel.send(embed);
	}
}