const guildConfig = require("../../models/guildConfigSchema");
const profileModel = require("../../models/profileSchema");

module.exports = async (oldMember, newMember) => {
	let guildConfigData = await guildConfig.fetchGuildConfig(newMember.guild.id);			//Retreive guild config
	let profileData = await profileModel.fetchProfile(newMember.id);						//Fetch profile

	let member = client.guilds.cache.get(newMember.guild.id).members.cache.get(newMember.id);

	if ((newMember.channelID === guildConfigData.privateVoiceChannel) || (newMember.channelID === guildConfigData.publicVoiceChannel)) {			//Create private/public voice if ids match
		const channel = await newMember.guild.channels.create(`VC - ${member.user.tag}`, {
			type: "voice"
		});
		channel.setParent(client.channels.cache.get(newMember.channelID).parentID);

		switch (newMember.channelID) {
			case guildConfigData.privateVoiceChannel:
				channel.overwritePermissions([
					{
						id: client.guilds.cache.get(newMember.guild.id).roles.everyone,
						deny: ["VIEW_CHANNEL", "SPEAK", "CONNECT", "CREATE_INSTANT_INVITE"] 	//Deny permissions
					},
					{
						id: newMember.id,
						allow: ["VIEW_CHANNEL", "SPEAK", "CONNECT"]								//Allow permissions
					}
				]);
				break;
			case guildConfigData.publicVoiceChannel:
				channel.overwritePermissions([
					{
						id: newMember.id,
						allow: ["VIEW_CHANNEL", "SPEAK", "CONNECT"]								//Allow permissions
					}
				]);
				break;
		}
		
		profileData.privateVoiceID = channel.id;		//Register channel id in user's profile
		profileData.save();
		member.voice.setChannel(channel);				//Move user into the newly created voicechat
	}
}