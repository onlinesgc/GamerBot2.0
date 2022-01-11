module.exports = async (oldMember, newMember,client) => {
	let newUserChannel = await client.guilds.cache.get(newMember.guild.id).channels.cache.get(newMember.channelId);
	let oldUserChannel = await client.guilds.cache.get(oldMember.guild.id).channels.cache.get(oldMember.channelId);
	if(oldMember.channelId == newMember.channelId) return;

	if (oldUserChannel === undefined && newUserChannel) {				//Someone joined a voicechannel
		require("../custom/voiceJoin")(oldMember, newMember,client);

	} else if (newUserChannel === undefined && oldUserChannel) {		//Someone left a voice channel
		require("../custom/voiceLeave")(oldMember, newMember,client);

	} else if (oldUserChannel && newUserChannel) {						//Someone switched to another voice channel
		require("../custom/voiceSwitch")(oldMember, newMember,client);
	}
}