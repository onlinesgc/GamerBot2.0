const configModel = require("../models/configSchema");
const profileModel = require("../models/profileSchema");
module.exports = async (oldMember, newMember,client) => {
    let voiceMember; 
    if(oldMember != undefined) voiceMember = oldMember;
    else voiceMember = newMember;

    let profileData = await profileModel.fetchProfile(voiceMember.id);			    		//Fetch profile
    if(profileData.privateVoiceID == "" || profileData.privateVoiceID==undefined) return;
    try{
        await voiceMember.guild.channels.cache.get(profileData.privateVoiceID).delete();
        profileData.privateVoiceID = "";
        await profileData.save();
    }
    catch(err){
        console.log(err);
    }
}