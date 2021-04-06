const Discord = require("discord.js");

class Log {
	static client = null;
	static errorChannel = null;

	static configure(client, errorChannel) {
		this.client = client;
		this.errorChannel = errorChannel;
	}

	static error(body) {
		const line = (((new Error('log'))
			.stack.split('\n')[2] || '…')
			.match(/\(([^)]+)\)/) || [, 'not found'])[1];
		// console.log(`${line}\n`, body);
		
		const lineNumber = line.split(":").slice(-2)[0];
		const column = line.split(":").slice(-1)[0];
		const file = line.replace(/\\/g, "/").split("/").slice(-1)[0].split(":")[0];

		let channel = this.client.channels.cache.get(this.errorChannel);

		const embed = new Discord.MessageEmbed()
				.setColor("#cf2525")
				.setTitle(`Error`)
				.setDescription(`Error occured in \`${file}\` at line \`${lineNumber}\`:\`${column}\`!`)
				.addFields(
					{ name: "Error message:", value: `\`\`\`${body}\`\`\`` }
				)
		return channel.send(embed);
	}
}

module.exports = { Log };