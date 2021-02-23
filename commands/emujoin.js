module.exports = {
	name: "emujoin",
	description: "Emulate someone joining the guild!",
	perms: ["adminCmd"],
	async do(client, message, args, Discord) {
		client.emit("guildMemberAdd", member);
	}
}