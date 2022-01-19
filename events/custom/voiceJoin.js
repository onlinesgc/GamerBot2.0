const guildConfig = require("../../models/guildConfigSchema");
const profileModel = require("../../models/profileSchema");
const functions = require("../../functions");
module.exports = async (oldMember, newMember,client) => {
	let guildConfigData = await guildConfig.fetchGuildConfig(newMember.guild.id);			//Retreive guild config
	let profileData = await profileModel.fetchProfile(newMember.id);						//Fetch profile

	let member = client.guilds.cache.get(newMember.guild.id).members.cache.get(newMember.id);
	let infoChannel;
	if(guildConfigData.infoVoiceChannel != "" || guildConfigData.infoVoiceChannel != undefined) infoChannel = newMember.guild.channels.cache.get(guildConfigData.infoVoiceChannel);
	await functions.RemoveVoiceChannels(oldMember, newMember,client)
	if ((newMember.channelId === guildConfigData.privateVoiceChannel) || (newMember.channelId === guildConfigData.publicVoiceChannel)) {			//Create private/public voice if ids match
		const channel = await newMember.guild.channels.create(`VC - ${member.user.tag}`, {
			type: "GUILD_VOICE"
		});
		await channel.setParent(newMember.channel.parentId);
		let thread;
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
				thread = await createThread(infoChannel);
				break;
			case guildConfigData.publicVoiceChannel:
				await channel.permissionOverwrites.set([
					{
						id: newMember.id,
						allow: ["VIEW_CHANNEL", "SPEAK", "CONNECT"]								//Allow permissions
					}
				]);
				thread = await createThread(infoChannel);
				break;
		}
		
		profileData.privateVoiceID = channel.id;		//Register channel id in user's profile
		profileData.privateVoiceThreadID = thread.id
		profileData.save();
		await newMember.setChannel(channel);				//Move user into the newly created voicechat
	}
	async function createThread(channel){
		let thread
		if(channel.guild.premiumTier!="NONE"){
			thread = await channel.threads.create({
				name:`Threads - ${member.user.tag}`,
				autoArchiveDuration: 120,
				type: 'GUILD_PRIVATE_THREAD',
				invitable:true,
				reason: `Voice Thread>`,
			})
			thread.members.add(newMember.id);
			thread.send(`Made a new voice chat thread for you! <@!${newMember.id}>`)
		}
		else{
			thread = await channel.threads.create({
				name:`Threads - ${member.user.tag}`,
				autoArchiveDuration: 60,
				reason: `Voice Thread>`,
			})
			thread.members.add(newMember.id);
			thread.send(`Made a new voice chat thread for you! <@!${newMember.id}>`)

		}
		return thread;
	}
}