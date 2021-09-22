const profileModel = require("../models/profileSchema");
const Discord = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	name: "xptoplist",
	aliases: [],
	description: "Se XP-topplistan",
	usage: [
		"xptoplist <userCount>",
		"xptoplist"
	],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("xptoplist")
		.setDescription("Se XP-topplistan")
		.addIntegerOption((option) => {
			return option.setName("amount").setDescription("Användar mängd").setRequired(false)
	}),
	async do(message, args, profileData, isInteraction) {

		async function createUserFields(profiles, startPointer, userCount) {
			let fields = [];
			let n = 1;
			for (profile of profiles.slice(startPointer, startPointer + userCount)) {
				const user = await message.client.users.fetch(profile.userID); //LAG FEST <-----. The thing that lags the xptoplist
				fields.push({
					name: (startPointer + n).toString(), value: `
					Användare: ${user.toString()}
					Level: \`${profile.level - 1}\`
				`});
				n++;
			}
			return fields;
		}

		if(isInteraction){
			if(message.options._hoistedOptions[0] != null) args[0] = message.options._hoistedOptions[0].value;	
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

		const profiles = await profileModel.fetchAll({ serverID: "516605157795037185" });

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
		let msg;	
		if(!isInteraction) msg = await message.channel.send({embeds:[embed], components:[row]});
		else msg = await message.reply( { embeds:[embed], components:[row], fetchReply:true} );

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
			if(!isInteraction) msg.edit({embeds:[embed], components:[row]});
			else message.editReply({embeds:[embed], components:[row]})
			data.deferUpdate()
		});

	}
}