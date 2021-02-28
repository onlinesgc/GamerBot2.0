const videoSuggestModel = require("../../models/videoSuggestSchema");

module.exports = {
	name: "videosuggest",
	channels: ["809393742637170708", "815324315536326677"],
	async do(client, message, Discord, profileData) {
		message.react("✅");
		message.react("❌");
		videoSuggestModel.addVideoSuggest(message);

		const similarMessages = new Set();
		let fields = [
			
		];
		
		for await (const doc of videoSuggestModel.videoSuggestModel.find()) {
			for (const word of message.content) {
				if (doc.messageContent.includes(word)) {
					similarMessages.add(doc);
				}
			}
		}
		
		let n = 1;
		for (const item of similarMessages) {
			fields.push({ name: `Förekomst ${n}`, value: `Meddelande: *${item.messageContent}*`})
			n++;
		}
		
		if (fields.length) {
			const embed = new Discord.MessageEmbed()
				.setColor("#f54242")
				.setTitle(`Liknande video-förslag`)
				.setDescription(`Liknande video-förslag hittades!`)
				.addFields(
					fields
				);
			return message.channel.send(embed);
		} else {
			return message.channel.send("Bra! Inga liknande video-förslag hittades.")
		}
	}
}