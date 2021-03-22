const profileModel = require("../models/profileSchema");
const Discord = require("discord.js");

module.exports = {
	name: "xptoplist",
	aliases: [],
	description: "Se XP-topplistan",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
		let userCount = 10;
		if (args[0]) {
			if (isNaN(args[0])) {
				return message.channel.send("Du måste specificera ANTALET användare du vill se på topplistan.");
			} else {
				userCount = args[0];
			}
		}

		const profiles = await profileModel.fetchAll();
		profiles.sort((a, b) => {
			return b.level - a.level;
		});

		let fields = [];
		let n = 1;
		for (profile of profiles.slice(0, userCount)) {
			const user = await message.client.users.fetch(profile.userID);
			fields.push({ name: n, value: `
				Användare: ${user}
				Level: ${profile.level}
			`} );
			n++;
		}

		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle("XP-topplista")
			.addFields(
				fields
			)
			.setTimestamp()
		message.channel.send(embed);
	}
}