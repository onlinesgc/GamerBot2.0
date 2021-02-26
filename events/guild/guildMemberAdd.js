const profileModel = require("../../models/profileSchema");

module.exports = async(client, Discord, member) => {
	let profile = await profileModel.create({
		userID: member.id,
		serverID: member.guild.id,
		xp: 0,
		lastMessageTimestamp: null
	});
	profile.save();
}