const profileModel = require("../models/profileSchema");

module.exports = {
	name: "setxp",
	aliases: [],
	description: "Set xp for specified user!",
	usage: [
		"setxp <mentionedUser> -x <xpAmount>",
		"setxp <mentionedUser> -t <xpTimeout>"
	],
	notes: [
		"*xpTimeout* mäts i millisekunder från att du skickar detta kommando."
	],
	perms: ["adminCmd"],
	async do(client, message, args, Discord) {
		if (!message.mentions.members.first()) {
			return message.channel.send("Du måste ange vilken användare du vill sätta xp'n för.")
		}
		let fields = [];
		if (!args[1]) {
			return message.channel.send("Du måste ange vilken operation du vill utföra!")
		} else {
			let profile_data = await profileModel.fetchProfileFromMessage(message);		//Fetch profile

			if (args[1] === "-x") {
				if (isNaN(args[2])) {
					return message.channel.send("Xp-värdet måste vara ett nummer!");
				} else {
					profile_data.xp = args[2];
					profile_data.save();
					fields.push({
						name: "XP",
						value: `Sätt ${message.mentions.members.first()}'s xp till ${profile_data.xp}!`
					});
				}
			} else if (args[1] === "-t") {
				if (isNaN(args[2])) {
					return message.channel.send("Xp-timeouten måste vara en timestamp!");
				} else {
					profile_data.xpTimeoutUntil = message.createdTimestamp + parseInt(args[2]);
					profile_data.save();
					fields.push({
						name: "XP Timeout",
						value: `Sätt ${message.mentions.members.first()}'s xp timeout till ${profile_data.xpTimeoutUntil}!`
					});
				}
			}
		}
		
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Set xp`)
			.addFields(
				fields
			)
		message.channel.send(embed);
	}
}