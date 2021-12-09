const Discord = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	name: "framesend",
	aliases: [],
	description: "framesend",
	usage: [],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("framesend")
		.setDescription("new frame btn")
        .addChannelOption((option =>{
            return option.setName("channel").setRequired(true).setDescription("sicka en frame knapp")
        }))
        .addStringOption((option =>{
            return option.setName("message").setDescription("Medelandet på knapen").setRequired(true)
        }))
        .addStringOption((option =>{
            return option.setName("message2").setDescription("Medelandet utanför knappen").setRequired(true)
        }))
        .addIntegerOption((option =>{
            return option.setName("frame").setRequired(true).setDescription("Frame number")
        })),
	async do(message, args, profileData, isInteraction) {
        if(!isInteraction) return message.channel.send("Detta är bara ett / command");
        let channel = message.options._hoistedOptions[0].channel;
        const row = new Discord.MessageActionRow()
        .addComponents(
            [
                new Discord.MessageButton()
                    .setStyle("DANGER")
                    .setLabel(`${message.options._hoistedOptions[1].value}`)
                    .setCustomId(`framesender:${message.options._hoistedOptions[3].value}`)
            ]
        )
        channel.send({components:[row],content:message.options._hoistedOptions[2].value})
	}
}
