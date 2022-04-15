const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "hidechannel",
	aliases: ["hide"],
	description: "Göm en kanal.",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("hidechannel")
		.setDescription("Göm en kanal"),
	async do(message, args, profileData, isInteraction) {
		message.channel.permissionOverwrites.edit(message.guild.id, {
			VIEW_CHANNEL: false
		});

		if(!isInteraction) message.channel.send("Denna kanal är nu gömd.");
		else message.editReply("Denna kanal är nu gömd.")
	}
}