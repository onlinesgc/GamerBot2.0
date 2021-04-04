const Discord = require("discord.js");

class Log {
	static client = null;
	static errorChannel = null;

	static configure(client, errorChannel) {
		this.client = client;
		this.errorChannel = errorChannel;
	}

	static error(body) {
		let channel = this.client.channels.cache.get(this.errorChannel);

		const embed = new Discord.MessageEmbed()
				.setColor("#cf2525")
				.setTitle(`Error`)
				.setDescription(`Error occured!`)
				.addFields(
					{ name: "Error message:", value: body }
				)
		return channel.send(embed);
	}
}

module.exports = { Log };