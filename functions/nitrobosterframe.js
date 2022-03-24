const configModel = require("../models/configSchema");
const profileModel = require("../models/profileSchema");
const guildConfig = require("../models/guildConfigSchema");
module.exports = async (guild) => {
    setInterval(() =>{
        guild.members.cache.forEach(async member =>{
            let profileData = await profileModel.fetchProfile(member.id, guild.id)
            if(member.roles.premiumSubscriberRole != undefined){
                if(!profileData.exclusiveFrames.includes("5")){
                    profileData.exclusiveFrames.push("5");
                    profileData.save()
                }
            }
            else{
                if(profileData.exclusiveFrames.includes("5")){
                    profileData.exclusiveFrames.splice(await profileData.exclusiveFrames.indexOf("5"),1);
                    if(profileData.profileFrame == "15") profileData.profileFrame = 0;
                    profileData.save()
                }
            }
        })
    }, 1000 * 60 * 10) //Evry 10 min it reloads all nitro boost frames.
}