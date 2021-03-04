module.exports = {
	name: "emujoin",
	aliases: [],
	description: "Emulate someone joining the guild!",
	usage: [],
	perms: ["adminCmd"],
	async do(client, message, args, Discord) {
		client.emit("guildMemberAdd", message.member);
		message.channel.send("Emulerade att någon anslöt till servern!");
	}
}