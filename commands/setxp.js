const profileModel = require("../models/profileSchema");
const ms = require("ms");
const Discord = require('discord.js');

module.exports = {
	name: "setxp",
	aliases: [],
	description: "Sätt xp eller xp timeout för en användare!",
	usage: [
		"setxp {<mentionedUser>|<userID>} -x <xpAmount>",
		"setxp {<mentionedUser>|<userID>} -t <xpTimeout>"
	],
	notes: [
		"*xpTimeout* mäts som standard i millisekunder från att du skickar detta kommando. Du kan också specificera värdet genom att sätta \`h\`, \`s\`, \`m\` etc. bakom. Exempel:\n\`60s\`, \`8h\` och \`2w\`"
	],
	perms: ["adminCmd"],
	async do(message, args, profileData) {
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
				if (ms(args[2]) == undefined) {
					return message.channel.send("Xp-timeouten måste kunna omvandlas till millisekunder!");
				} else {
					profile_data.xpTimeoutUntil = message.createdTimestamp + ms(args[2]);
					profile_data.save();
					fields.push({
						name: "XP Timeout",
						value: `Sätt ${member}'s xp timeout till ${profile_data.xpTimeoutUntil}!`
					});
				}
			} else {
				return message.channel.send("Operationen du specificerade finns inte. Använd help-kommandot för att se användningen av det här kommandot.");
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