const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true},
	serverID: { type: String, require: true },
	xp: { type: Number, default: 0 },
	lastMessageTimestamp: { type: Number },
	xpTimeoutUntil: { type: Number }
});

const model = mongoose.model("ProfileModels", profileSchema);

const fetchProfile = async (userID, serverID, lastMessageTimestamp = null, xpTimeoutUntil = null) => {
	let profileData = await model.findOne({ userID: userID });
	if (!profileData) {
		profileData = await model.create({
			userID: userID,
			serverID: serverID,
			xp: 0,
			lastMessageTimestamp: lastMessageTimestamp,
			xpTimeoutUntil: xpTimeoutUntil
		});
		profileData.save();
	}
	return profileData;
};

const fetchProfileFromMessage = async (message) => {
	return fetchProfile(message.author.id, message.guild.id, message.createdTimestamp, message.createdTimestamp);
};

module.exports = { profileModel: model, fetchProfile, fetchProfileFromMessage };