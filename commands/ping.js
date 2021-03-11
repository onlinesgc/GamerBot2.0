module.exports = {
	name: "ping",
	aliases: [],
	description: "Ping the bot!",
	usage: [],
	perms: [],
	async do(client, message, args, Discord) {
		const pinging_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`:ping_pong:  Ping`)
			.setDescription(`Pingar...`)
		let botMessage = await message.channel.send(pinging_embed);
		const pong_embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`:ping_pong:  Pong`)
			.setDescription(`Tog ${botMessage.createdTimestamp - message.createdTimestamp} millisekunder!`)
		botMessage.edit(pong_embed);
	}
}