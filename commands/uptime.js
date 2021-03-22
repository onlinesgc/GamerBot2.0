const Discord = require("discord.js");
const functions = require("../functions");

module.exports = {
	name: "uptime",
	aliases: [],
	description: "Få information om hur länge botten har varit uppe sedan senaste omstart.",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle("Uptime")
			.setDescription("Här kommer upptiden för botten!")
			.setThumbnail(message.client.user.avatarURL())
			.addFields(
				{ name: "Tid:", value: functions.msToString(message.client.uptime) },
				{ name: "Totala millisekunder:", value: message.client.uptime }
			)
			.setTimestamp()
		message.channel.send(embed);
	}
}