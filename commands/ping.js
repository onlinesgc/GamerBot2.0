const Discord = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	name: "ping",
	aliases: [],
	description: "Ping the bot!",
	usage: [],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Ping the bot!"),
	async do(message, args, profileData, isInteraction) {
		const pinging_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`:ping_pong:  Ping`)
			.setDescription(`Pingar...`);
		let botMessage;
		if(!isInteraction) botMessage = await message.channel.send({embeds:[pinging_embed]});
		else botMessage = await message.editReply({embeds:[pinging_embed], ephemeral:false, fetchReply:true} );
		const pong_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`:ping_pong:  Pong`)
			.setDescription(`Tog ${botMessage.createdTimestamp - message.createdTimestamp} millisekunder!`)
		if(!isInteraction) botMessage.edit({embeds:[pong_embed]});
		else message.editReply({embeds:[pong_embed]})
	}
}
