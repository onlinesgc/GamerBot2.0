const profileModel = require("../../models/profileSchema");

module.exports = async (client, Discord, member) => {
	await profileModel.fetchProfile(member.id, member.guild.id);		//Fetch profile
}