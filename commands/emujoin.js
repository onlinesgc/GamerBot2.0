module.exports = {
	name: "emujoin",
	description: "Ping the bot!",
	async do(client, message, args, Discord) {
		client.emit("guildMemberAdd");
	}
}