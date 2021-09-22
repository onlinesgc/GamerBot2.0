const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "showchannel",
	aliases: ["show"],
	description: "Visa en kanal.",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("showchannel")
		.setDescription("Visa en kanal."),
	async do(message, args, profileData,isInteraction) {
		message.channel.permissionOverwrites.edit(message.guild.id, {
			VIEW_CHANNEL: true
		});

		if(!isInteraction) message.channel.send("Denna kanal är nu synlig.");
		else message.reply("Denna kanal är nu synlig.")
	}
}