const Discord = require('discord.js');

module.exports = {
	name: "serverinfo",
	aliases: [],
	description: "Print server information!",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle(`Serverinfo - ${message.guild.name}`)
			.setImage(message.guild.iconURL())
			.addFields(
				{ name: "Medlemmar", value:  message.guild.memberCount.toString(),inline:false}
			)
		message.channel.send({embeds:[embed]});
	}
}