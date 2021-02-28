const videoSuggestModel = require("../../models/videoSuggestSchema");

module.exports = {
	name: "videosuggest",
	channels: ["809393742637170708", "815324315536326677"],
	async do(client, message, Discord, profileData) {
		message.react("✅");
		message.react("❌");
		videoSuggestModel.addVideoSuggest(message);
	}
}