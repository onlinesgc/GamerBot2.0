const mongoose = require("mongoose");

const videoSuggestSchema = new mongoose.Schema({
	channelID: { type: String },
    serverID: { type: String },
    userID: { type: String },
    messageID: { type: String, unique: true },
	messageContent: { type: String }
});

const model = mongoose.model("videoSuggestModel", videoSuggestSchema);

const addVideoSuggest = async (message) => {
	videoSuggestData = await model.findOne({ messageID: message.id });
	if (!videoSuggestData) {
		let videoSuggestData = await model.create({
			channelID: message.channel.id,
            serverID: message.guild.id,
			userID: message.author.id,
			messageID: message.id,
            messageContent: message.content
		});
		await videoSuggestData.save();
	}
	return videoSuggestData;
};

module.exports = { videoSuggestModel: model, addVideoSuggest };