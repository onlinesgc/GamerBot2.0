const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "lockchannel",
	aliases: ["lock"],
	description: "Lås en kanal så att den blir skrivskyddad.",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("lockchannel")
		.setDescription("Lås en kanal så att den blir skrivskyddad."),
	async do(message, args, profileData, isInteraction) {
		message.channel.permissionOverwrites.edit(message.guild.id, {
			SEND_MESSAGES: false
		});

		if(!isInteraction) message.channel.send("Denna kanal är nu låst/skrivskyddad.");
		else message.reply("Denna kanal är nu låst/skrivskyddad.")
	}
}