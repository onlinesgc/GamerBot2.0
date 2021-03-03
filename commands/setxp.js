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
		let member;
		let user;
		if (!args[0]) {
			return message.channel.send("Du måste ange vilken användare du vill sätta xp'n för.");
		} else {
			if (message.mentions.members.first()) {
				member = message.mentions.members.first();
				user = message.mentions.users.first();
			} else {
				member = await message.guild.members.fetch(args[0]);
				user = await client.users.fetch(args[0]);
			}
		}
		let fields = [];
		if (!args[1]) {
			return message.channel.send("Du måste ange vilken operation du vill utföra!")
		} else {
			let profile_data = await profileModel.fetchProfile(member.id, message.guild.id);		//Fetch profile

			if (args[1] === "-x") {
				if (isNaN(args[2])) {
					return message.channel.send("Xp-värdet måste vara ett nummer!");
				} else {
					profile_data.xp = args[2];
					profile_data.save();
					fields.push({
						name: "XP",
						value: `Sätt ${member}'s xp till ${profile_data.xp}!`
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
						value: `Sätt ${member}'s xp timeout till ${profile_data.xpTimeoutUntil}!`
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