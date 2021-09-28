const profileModel = require("../../models/profileSchema");

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
                        await command.do(Interaction, [], profileData, true);
                        executedCommand = true;
                    }
                    else {
                        await Interaction.reply({ content: "You don't have prems to use this command" });
                        executedCommand = true;
                    }
                }
                else if (perms[i].neededPermission == null) {
                    if (profileData.level - 1 >= perms[i].neededLevel || Interaction.member.permissions.has("ADMINISTRATOR")) {
                        await command.do(Interaction, [], profileData, true);
                        executedCommand = true;
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