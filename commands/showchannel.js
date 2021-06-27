module.exports = {
	name: "showchannel",
	aliases: ["show"],
	description: "Visa en kanal.",
	usage: [],
	perms: ["adminCmd"],
	async do(message, args, profileData) {
		message.channel.updateOverwrite(message.guild.id, {
			VIEW_CHANNEL: true
		});

		message.channel.send("Denna kanal är nu synlig.");
	}
}