module.exports = {
	name: "help",
	aliases: [],
	description: "Get help with bot commands!",
	perms: [],
	async do(client, message, args, Discord, profileData) {
		if (args[0]) {
			return message.channel.send(getSpecificCmd(client, Discord, args[0]));
		} else {
			return message.channel.send(getAllCmds(client, Discord));
		}
	}
}

function getAllCmds(client, Discord) {
	const embed = new Discord.MessageEmbed()
		.setColor("#f54242")
		.setTitle(`Help`)
		.setDescription(`Visar lista med kommandon.`)
		.addFields(
			{ name: "Kommandon", value: client.commands.map(cmd => cmd.name) }
		)
	return embed;
}

function getSpecificCmd(client, Discord, input) {
	const cmd = client.commands.get(input.toLowerCase()) || client.commands.find(a => a.aliases && a.aliases.includes(input.toLowerCase()));

	if (!cmd) {
		return "Kommandot kunde inte hittas!";
	} else {
		let aliases = cmd.aliases.join(", ");
		if (!aliases) {
			aliases = "Det finns inga alias för det här kommandot.";
		}
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`${cmd.name} - Help`)
			.setDescription(`Visar information om kommandot *${cmd.name}*.`)
			.addFields(
				{ name: "Beskrivning", value: cmd.description },
				{ name: "Alias", value: aliases }
			)
		return embed;
	}
}