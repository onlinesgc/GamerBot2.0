module.exports = {
	name: "gaming",
	permittedMessages: ["gaming"],
	description: "Prints gaming if you are lucky!",
	perms: [],
	async do(client, message, args, Discord) {
		if (message.channel.id == "809483972282810390" || message.channel.id == "780765093343395880") {
			if (Math.floor(Math.random() * 100) > 86) {
				message.channel.send("**GAMING! 🎮**");
			}
		}
	}
}