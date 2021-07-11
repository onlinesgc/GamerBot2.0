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
					name: (startPointer + n).toString(), value: `
					Användare: ${user.toString()}
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
				userCount = parseInt(args[0]);
			}
		}

		//Sort profiles in the right order
		const profiles = await profileModel.fetchAll({ serverID: "516605157795037185" });
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
		const row = new Discord.MessageActionRow()
			.addComponents(
				[
					new Discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("⬅️")
						.setCustomId("left"),
					new Discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("➡️")
						.setCustomId("right"),
				]
			);
		let msg = await message.channel.send({embeds:[embed], components:[row]});

		//Create a collector for page selecting
		const filter = data => {
			return true;
		};
		const collector = msg.createMessageComponentCollector(filter);

		//Collector reaction event
		collector.on("collect", async data => {
			switch (data.customId) {
				case "left":
					if (startPointer > 0) {
						startPointer -= userCount;
					}
					break;
				case "right":
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
			msg.edit({embeds:[embed], components:[row]});
			data.deferUpdate()
		});

	}
}