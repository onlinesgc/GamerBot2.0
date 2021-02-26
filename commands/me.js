const functions = require("../functions")

module.exports = {
	name: "me",
	aliases: ["myinfo"],
	description: "Print information about user!",
	perms: [],
	async do(client, message, args, Discord, profileData) {
		let fields = [
			{ name: "XP", value: profileData.xp }
		];
		if (profileData.xpTimeoutUntil - message.createdTimestamp > 0) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profileData.xpTimeoutUntil - message.createdTimestamp) });
		}
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`User info`)
			.setDescription(`${message.member}'s user information.`)
			.addFields(
				fields
			)
		message.channel.send(embed);
	}
}