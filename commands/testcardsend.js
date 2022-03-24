const {SlashCommandBuilder} = require("@discordjs/builders")
const { cardSendChance} = require("../events/custom/CardCounter");
module.exports = {
	name: "testcardsend",
	aliases: [],
	description: "Testa att sicka ett kort i någon kanal",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("testcardsend")
		.setDescription("Testa att sicka ett kort i någon kanal"),
	async do(message, args, profileData,isInteraction) {
        cardSendChance(message);
        if(isInteraction) message.reply("tested");
	}
}