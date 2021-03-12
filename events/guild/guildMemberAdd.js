const profileModel = require("../../models/profileSchema");

module.exports = async (member, client) => {
	await profileModel.fetchProfile(member.id, member.guild.id);		//Fetch profile
}