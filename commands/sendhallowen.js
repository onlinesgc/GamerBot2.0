const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "sendhallowen",
	aliases: [],
	description: "Admin command",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("sendhallowen")
		.setDescription("Admin command")
        .addChannelOption((option) =>{
            return option.setName("channelname").setDescription("The channel were the message is going to get sent").setRequired(true);
        }),
	async do(message, args, profileData, isInteraction) {
        let channel;
        if(!isInteraction){
            if(args[0] == undefined) return message.channel.send("You must enter a channel id");
            channel = message.guild.channels.cache.get(args[0]);
        }
        else{
            channel = message.options._hoistedOptions[0].channel;
        }

        channel.send("test");
        if(isInteraction) message.reply("sent message to the channel")
        
	}
}