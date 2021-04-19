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
				{ name: "Medlemmar", value: message.guild.memberCount },
				{ name: "Status", value: `
					${message.guild.members.cache.filter(m => m.presence.status === "online").size} medlemmar är online!
				`}
			)
		message.channel.send(embed);
	}
}