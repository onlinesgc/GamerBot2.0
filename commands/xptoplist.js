const profileModel = require("../models/profileSchema");
const Discord = require("discord.js");

module.exports = {
	name: "xptoplist",
	aliases: [],
	description: "Se XP-topplistan",
	usage: [
		"xptoplist <userCount>",
		"xptoplist"
	],
	perms: [],
	async do(message, args, profileData) {
		async function createUserFields(profiles, startPointer, userCount) {
			let fields = [];
			let n = 1;
			for (profile of profiles.slice(startPointer, startPointer + userCount)) {
				const user = await message.client.users.fetch(profile.userID);
				fields.push({
					name: startPointer + n, value: `
					Användare: ${user}
					Level: \`${profile.level - 1}\`
				`});
				n++;
			}
			return fields;
		}

		//Error handling
		let userCount = 10;
		let startPointer = 0;
		if (args[0]) {
			if (isNaN(args[0])) {
				return message.channel.send("Du måste specificera ANTALET användare du vill se på topplistan.");
			} else {
				userCount = args[0];
			}
		}

		//Sort profiles in the right order
		const profiles = await profileModel.fetchAll({ serverID: message.guild.id });
		profiles.sort((a, b) => {
			return b.xp - a.xp;
		});
		profiles.sort((a, b) => {
			return b.level - a.level;
		});

		//Send the first message
		let fields = await createUserFields(profiles, startPointer, userCount);
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle("XP-topplista")
			.addFields(
				fields
			)
			.setTimestamp()
		let msg = await message.channel.send(embed);
		await msg.react("⬅️");
		await msg.react("➡️");

		//Create a collector for page selecting
		const filter = (reaction, user) => {
			return true;
		};
		const collector = msg.createReactionCollector(filter);

		//Collector reaction event
		collector.on("collect", async (reaction, user) => {
			reaction.users.remove(message.author.id);		//Remove reaction
			switch (reaction.emoji.name) {
				case "⬅️":
					if (startPointer > 0) {
						startPointer -= userCount;
					}
					break;
				case "➡️":
					startPointer += userCount;
					break;
			}
			let fields = await createUserFields(profiles, startPointer, userCount);
			const embed = new Discord.MessageEmbed()
				.setColor("#0099ff")
				.setTitle("XP-topplista")
				.addFields(
					fields
				)
				.setTimestamp()
			msg.edit(embed);
		});

	}
}