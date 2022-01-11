const functions = require("../../functions");
const guildConfig = require("../../models/guildConfigSchema");
module.exports = async (oldMember, newMember,client) => {
    let guildConfigData = await guildConfig.fetchGuildConfig(newMember.guild.id);
    if(oldMember.channelId != guildConfigData.privateVoiceChannel && oldMember.channelId != guildConfigData.publicVoiceChannel){ // Checks if this is the first move.
        await functions.RemoveVoiceChannels(oldMember, newMember,client)
    }
}