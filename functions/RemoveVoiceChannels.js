const configModel = require("../models/configSchema");
const profileModel = require("../models/profileSchema");
const guildConfig = require("../models/guildConfigSchema");
module.exports = async (oldMember, newMember,client) => {
    let voiceMember; 
    if(oldMember != undefined) voiceMember = oldMember;
    else voiceMember = newMember;
    let guildConfigData = await guildConfig.fetchGuildConfig(newMember.guild.id);
    let profileData = await profileModel.fetchProfile(voiceMember.id);			    		//Fetch profile
    if(profileData.privateVoiceID == "" || profileData.privateVoiceID==undefined) return;
    try{
        await voiceMember.guild.channels.cache.get(profileData.privateVoiceID).delete();
        if(profileData.privateVoiceThreadID != "" ) await voiceMember.guild.channels.cache.get(guildConfigData.infoVoiceChannel).threads.cache.get(profileData.privateVoiceThreadID).delete()
        profileData.privateVoiceThreadID = "";
        profileData.privateVoiceID = "";
        await profileData.save();
    }
    catch(err){
        console.log(err);
    }
}