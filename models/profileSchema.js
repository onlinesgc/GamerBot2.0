const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    serverID: { type: String, require: true },
    xp: { type: Number, default: 0 },
    lastMessageTimestamp: { type: Number },
    xpTimeoutUntil: { type: Number },
    level: { type: Number },
    reminders: { type: Array },
    colorHexCode: { type: String },
	privateVoiceID: { type: String, default: "" },
	privateVoiceThreadID: { type: String, default: "" },
    profileFrame: {type: String},
	hasLeftTicket: {type: Boolean},
    xpboost: { type: Object, default: {
	    multiplier: 1,
	    stopBoostTimestamp: null}},
    exclusiveFrames: {type: Array},
	other: {type: Object, default:{
		hasHallowenFrame: false
	}}
});

const model = mongoose.model("ProfileModels", profileSchema);

const fetchProfile = async (userID, serverID, lastMessageTimestamp = null, xpTimeoutUntil = null, colorHexCode = "#787C75", profileFrame = 0) => {
	let profileData = await model.findOne({ userID: userID });
	if (!profileData) {
		profileData = await model.create({
			userID: userID,
			serverID: serverID,
			xp: 0,
			lastMessageTimestamp: lastMessageTimestamp,
			xpTimeoutUntil: xpTimeoutUntil,
			level: 1,
			reminders: [],
			colorHexCode: colorHexCode,
			profileFrame : profileFrame,
			exclusiveFrames: []
		});
		await profileData.save();
	}
	return profileData;
};

const fetchProfileFromMessage = async (message) => {
	return fetchProfile(message.author.id, message.guild.id, message.createdTimestamp, message.createdTimestamp);
};

const fetchProfileFromInteraction = async (interaction) =>{
	return fetchProfile(interaction.user.id, interaction.guildId, interaction.createdTimestamp, interaction.createdTimestamp);
}

const fetchAll = async (filter, maxUsers = 100) => {
	filter = filter || {};
	let profiles = model.find(filter).sort({level:-1}).sort({xp:-1}).limit(maxUsers);
	return profiles;
};

module.exports = { profileModel: model, fetchProfile, fetchProfileFromMessage, fetchAll , fetchProfileFromInteraction};
