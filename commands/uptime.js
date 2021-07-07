const Discord = require("discord.js");
const functions = require("../functions");
const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	name: "uptime",
	aliases: [],
	description: "Få information om hur länge botten har varit uppe sedan senaste omstart och när den startades om",
	usage: [],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("uptime")
		.setDescription("Få information om hur länge botten har varit uppe sedan senaste omstart och när den startades om"),
    async do(message, args, profileData,isInteraction) {
	let currentTime = new Date().getTime();
	let restartTime = new Date(currentTime - message.client.uptime);
	
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle("Uptime")
			.setDescription("Här kommer upptiden för botten!")
			.setThumbnail(message.client.user.avatarURL())
			.addFields(
				{ name: "Tid:", value: functions.msToString(message.client.uptime).toString() },
			    { name: "Totala millisekunder:", value: message.client.uptime.toString() },
			    { name: "Omstart skedde vid:", value: restartTime.toLocaleDateString().toString() + " " + restartTime.toLocaleTimeString().toString() }
			)
			.setTimestamp()
		if(!isInteraction) message.channel.send({embeds:[embed]});
		else message.reply({embeds:[embed]})
	}
}
