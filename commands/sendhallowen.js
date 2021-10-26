const {SlashCommandBuilder} = require("@discordjs/builders")
const discord = require("discord.js");
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
        const row = new discord.MessageActionRow()
        .addComponents(
            [
                new discord.MessageButton()
                    .setStyle("DANGER")
                    .setCustomId("trick")
                    .setLabel("Bus"),
                new discord.MessageButton()
                    .setStyle("SUCCESS")
                    .setCustomId("treat")
                    .setLabel("Godis"),
            ]
        );
        channel.send({content:"**Boooooo! Vill du ha bus eller godis?** \nVälj noga, du kan bara välja en!", components:[row]});

        if(isInteraction) message.reply("sent message to the channel")
        
	}
}