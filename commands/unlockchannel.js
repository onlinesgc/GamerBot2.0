const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "unlockchannel",
	aliases: ["unlock"],
	description: "Lås upp en kanal så att användare kan skriva i den.",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("unlockchannel")
		.setDescription("Lås upp en kanal så att användare kan skriva i den."),
	async do(message, args, profileData,isInteraction) {
		message.channel.permissionOverwrites.edit(message.guild.id, {
			SEND_MESSAGES: true
		});

		if(!isInteraction) message.channel.send("Denna kanal har nu blivit upplåst/meddelanden accepteras.");
		else message.reply("Denna kanal har nu blivit upplåst/meddelanden accepteras.");
	}
}