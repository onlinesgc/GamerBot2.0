const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "emujoin",
	aliases: [],
	description: "Emulate someone joining the guild!",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("emujoin")
		.setDescription("Emulate someone joining the guild!"),
	async do(message, args, profileData,isInteraction) {
		message.client.emit("guildMemberAdd", message.member);
		if(!isInteraction) message.channel.send("Emulerade att någon anslöt till servern!");
		else message.editReply("Emulerade att någon anslöt till servern!");
	}
}