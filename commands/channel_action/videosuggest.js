const videoSuggestModel = require("../../models/videoSuggestSchema");
const Discord = require('discord.js');

module.exports = {
	name: "videosuggest",
	channels: ["809393742637170708", "815324315536326677"],
	async do(message, profileData) {
		message.react("✅");
		message.react("❌");
		// videoSuggestModel.addVideoSuggest(message);

		// const similarMessages = new Set();
		// let fields = [
			
		// ];
		
		// for await (const doc of videoSuggestModel.videoSuggestModel.find()) {
		// 	for (const word of message.content) {
		// 		if (doc.messageContent.includes(word)) {
		// 			similarMessages.add(doc);
		// 		}
		// 	}
		// }
		
		// let n = 1;
		// for (const item of similarMessages) {
		// 	let itemMessage;
		// 	try {
		// 		let itemMessageTmp = await message.channel.messages.fetch(item.messageID);
		// 		itemMessage = itemMessageTmp.content;
		// 	} catch {
		// 		itemMessage = item.messageContent;
		// 	}
		// 	fields.push({ name: `Förekomst ${n}`, value: `Meddelande: *${itemMessage}*\nAnvändare: ${message.guild.members.cache.get(item.userID)}`})
		// 	n++;
		// }
		
		// if (fields.length) {
		// 	const embed = new Discord.MessageEmbed()
		// 		.setColor("#f54242")
		// 		.setTitle(`Liknande video-förslag`)
		// 		.setDescription(`Liknande video-förslag hittades!`)
		// 		.addFields(
		// 			fields
		// 		);
		// 	return message.channel.send(embed);
		// } else {
		// 	return message.channel.send("Bra! Inga liknande video-förslag hittades.")
		// }
	}
}