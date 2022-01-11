const functions = require("../../functions");
module.exports = async (oldMember, newMember,client) => {
	await functions.RemoveVoiceChannels(oldMember, newMember,client)
}