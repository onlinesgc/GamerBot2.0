const configModel = require("../models/configSchema");
const profileModel = require("../models/profileSchema");
const guildConfig = require("../models/guildConfigSchema");
const { getRandomIntRange } = require("../functions");
module.exports = async (oldMember, newMember,client) => {
    let voiceMember; 
    if(oldMember != undefined) voiceMember = oldMember;
    else voiceMember = newMember;
    let guildConfigData = await guildConfig.fetchGuildConfig(newMember.guild.id);
    let profileData = await profileModel.fetchProfile(voiceMember.id);			    		//Fetch profile
    if(profileData.privateVoiceID == "" || profileData.privateVoiceID==undefined) return;
    try{
        if(voiceMember.channel.members.size > 0){
            let member = voiceMember.channel.members.at(0)
            let profileDataNewOwner = await profileModel.fetchProfile(member.id, voiceMember.guild.id)
            profileDataNewOwner.privateVoiceThreadID = profileData.privateVoiceThreadID;
            profileDataNewOwner.privateVoiceID = profileData.privateVoiceID;
            profileData.privateVoiceThreadID = "";
            profileData.privateVoiceID = "";
            await profileData.save();
            await profileDataNewOwner.save();
            voiceMember.guild.channels.cache.forEach(async element => {
                if(element.threads != undefined){
                    let threed = await element.threads.cache.find(x => x.id == profileDataNewOwner.privateVoiceThreadID)
                    if(threed != undefined) await threed.send(`__**${voiceMember.member.user.username}**__ har lämmnat röstkanalen. Röstkanlens nya ägare är nu __**${member.user.username}**__`)
                }
            });
        }
        else{
            await voiceMember.guild.channels.cache.get(profileData.privateVoiceID).delete();
            if(profileData.privateVoiceThreadID != "" ) await voiceMember.guild.channels.cache.get(guildConfigData.infoVoiceChannel).threads.cache.get(profileData.privateVoiceThreadID).delete()
            profileData.privateVoiceThreadID = "";
            profileData.privateVoiceID = "";
            await profileData.save();
        }
    }
    catch(err){
        console.log(err);
    }
}