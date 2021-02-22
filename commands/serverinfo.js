module.exports = {
	name: "serverinfo",
	description: "Print server information!",
	async do(client, message, args, Discord) {
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle(`Serverinfo - ${message.guild.name}`)
			.setImage(message.guild.iconURL())
			.addFields(
				{ name: "id", value: message.guild.id }
			)
		message.channel.send(embed);
	}
}