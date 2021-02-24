module.exports = {
	name: "serverinfo",
	aliases: [],
	description: "Print server information!",
	perms: [],
	async do(client, message, args, Discord) {
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle(`Serverinfo - ${message.guild.name}`)
			.setImage(message.guild.iconURL())
			.addFields(
				{ name: "Medlemmar", value: message.guild.memberCount }
			)
		message.channel.send(embed);
	}
}