const guildConfig = require("../../models/guildConfigSchema");
const profileModel = require("../../models/profileSchema");
const functions = require("../../functions");
module.exports = async (oldMember, newMember,client) => {
	let guildConfigData = await guildConfig.fetchGuildConfig(newMember.guild.id);			//Retreive guild config
	let profileData = await profileModel.fetchProfile(newMember.id);						//Fetch profile

	let member = client.guilds.cache.get(newMember.guild.id).members.cache.get(newMember.id);
	await functions.RemoveVoiceChannels(oldMember, newMember,client)
	if ((newMember.channelId === guildConfigData.privateVoiceChannel) || (newMember.channelId === guildConfigData.publicVoiceChannel)) {			//Create private/public voice if ids match
		const channel = await newMember.guild.channels.create(`VC - ${member.user.tag}`, {
			type: "GUILD_VOICE"
		});
		await channel.setParent(newMember.channel.parentId);

		switch (newMember.channelId) {
			case guildConfigData.privateVoiceChannel:
				await channel.permissionOverwrites.set([
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
				await channel.permissionOverwrites.set([
					{
						id: newMember.id,
						allow: ["VIEW_CHANNEL", "SPEAK", "CONNECT"]								//Allow permissions
					}
				]);
				break;
		}
		
		profileData.privateVoiceID = channel.id;		//Register channel id in user's profile
		profileData.save();
		await newMember.setChannel(channel);				//Move user into the newly created voicechat
	}
}