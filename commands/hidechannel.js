module.exports = {
	name: "hidechannel",
	aliases: ["hide"],
	description: "Göm en kanal.",
	usage: [],
	perms: ["adminCmd"],
	async do(message, args, profileData) {
		message.channel.permissionOverwrites.edit(message.guild.id, {
			VIEW_CHANNEL: false
		});

		message.channel.send("Denna kanal är nu gömd.");
	}
}