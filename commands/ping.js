module.exports = {
	name: "ping",
	description: "Ping the bot!",
	async do(client, message, args, Discord) {
		const pinging_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Pinging`)
			.setDescription(`Pinging...`)
		var botMessage = await message.channel.send(pinging_embed);
		const pong_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`:ping_pong:  Pong`)
			.setDescription(`Took ${botMessage.createdTimestamp - message.createdTimestamp} ms!`)
		message.channel.send(pong_embed);
	}
}