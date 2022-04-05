const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "sendmessage",
	aliases: [],
	description: "Sends messages as bot",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("sendmessage")
		.setDescription("Sends messages as bot")
        .addChannelOption((option)=>{
            return option.setName("channel").setDescription("channel to send to").setRequired(true)
        })
        .addStringOption((option)=>{
            return option.setName("message").setDescription("the thing you want to send").setRequired(true)
        }),
	async do(message, args, profileData,isInteraction) {
        if(!isInteraction) return;
        let channel = message.options._hoistedOptions[0].channel;
        channel.send(message.options._hoistedOptions[1].value);
        message.editReply("sent message");
	}
}