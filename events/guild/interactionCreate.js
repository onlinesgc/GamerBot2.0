const profileModel = require("../../models/profileSchema");
const {removeTicket} = require("../../commands/ticket");
//premisonList

var perms = [
    {
        permName: "adminCmd",
        neededPermission: "ADMINISTRATOR",
        neededLevel: "0"
    },
    {
        permName: "trustedCmd",
        neededPermission: null,
        neededLevel: "2"
    }
]

module.exports = async (Interaction, client) => {
    //frame code
    if(Interaction.customId != undefined){
        let profileData = await profileModel.fetchProfile(Interaction.user.id, Interaction.guildId, Interaction.createdTimestamp, Interaction.createdTimestamp);
        let y = false;
        if(await Interaction.customId.split(":")[0] == "framesender"){
            await profileData.exclusiveFrames.forEach(async element => {
                if(element == await Interaction.customId.split(":")[1]){
                    y = true;
                }
            });
            if(!y){
                profileData.exclusiveFrames.push(Interaction.customId.split(":")[1])
                await profileData.save();
                try{
                    Interaction.member.send("Nu ska du ha fått en ny ram. Skriv /setframe i <#822546907007811585> för att se vad du fått!")
                }
                catch(err){
                    
                }
                return Interaction.deferUpdate();
            }
        }
    }
    //Tar bort tickets om collector har dött
    if(Interaction.customId != undefined){
        let customIDTicket = Interaction.customId.split(":")
        if(customIDTicket[0] == "close_ticket"){
            let member = await Interaction.guild.members.cache.get(customIDTicket[2]);
            let channel = await Interaction.guild.channels.cache.get(customIDTicket[1]);
            removeTicket(Interaction,channel,member,customIDTicket[3]);
        }
    }


    if (!Interaction.isCommand()) return;
    const command = client.commands.get(Interaction.commandName)
    if (!command) return;
    let profileData = await profileModel.fetchProfile(Interaction.user.id, Interaction.guildId, Interaction.createdTimestamp, Interaction.createdTimestamp);
    try {
        let executedCommand = false;
        for (var i = 0; i < perms.length; i++) {
            if (command.perms.includes(perms[i].permName)) {
                if (perms[i].neededPermission != null) {
                    if (Interaction.member.permissions.has("ADMINISTRATOR")) {
                        try{
                            await command.do(Interaction, [], profileData, true);
                            executedCommand = true;
                        }
                        catch(error){}
                    }
                    else {
                        await Interaction.reply({ content: "You don't have prems to use this command" });
                        executedCommand = true;
                    }
                }
                else if (perms[i].neededPermission == null) {
                    if (profileData.level - 1 >= perms[i].neededLevel || Interaction.member.permissions.has("ADMINISTRATOR")) {
                        try{
                            await command.do(Interaction, [], profileData, true);
                            executedCommand = true;
                        }catch(err){

                        }
                    }
                    else {
                        await Interaction.reply({ content: "You don't have prems to use this command" });
                        executedCommand = true;
                    }
                }
            }
        }
        if (!executedCommand) await command.do(Interaction, [], profileData, true);
    } catch (error) {
        console.error(error);
        await Interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}