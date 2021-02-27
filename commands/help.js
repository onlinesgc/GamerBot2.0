module.exports = {
	name: "help",
	aliases: [],
	description: "Get help with bot commands!",
	usage: [],
	perms: [],
	async do(client, message, args, Discord, profileData) {
		if (args[0]) {
			return message.channel.send(getSpecificCmd(client, Discord, args[0], message));
		} else {
			return message.channel.send(getAllCmds(client, Discord, message));
		}
	}
}

function getAllCmds(client, Discord, message) {
	let fields = [
		{ name: "Medlem", value: client.commands.filter(element => !element.perms.includes("adminCmd")).map(cmd => cmd.name) }
	]
	if (message.member.hasPermission("ADMINISTRATOR")) {
		fields.push({ name: "Moderator", value: client.commands.filter(element => element.perms.includes("adminCmd")).map(cmd => cmd.name) });
	}
	const embed = new Discord.MessageEmbed()
		.setColor("#f54242")
		.setTitle(`Help`)
		.setDescription(`Visar lista med kommandon.`)
		.addFields(
			fields
		)
	return embed;
}

function getSpecificCmd(client, Discord, input, message) {
	const cmd = client.commands.get(input.toLowerCase()) || client.commands.find(a => a.aliases && a.aliases.includes(input.toLowerCase()));

	if (!cmd) {
		return "Kommandot kunde inte hittas!";
	} else if (cmd.perms.includes("adminCmd") && !message.member.hasPermission("ADMINISTRATOR")) {
		return "Du har inte tillåtelse att visa information om hur det här kommandot används.";
	} else {
		let aliases = cmd.aliases.join(", ");
		if (!aliases) {
			aliases = "Det finns inga alias för det här kommandot.";
		}
		let usages = cmd.usage.join("\n");
		if (!usages) {
			usages = "Användningsområdet är inte definierat för det här kommandot.";
		}
		
		let fields = [
			{ name: "Beskrivning", value: cmd.description },
			{ name: "Alias", value: aliases },
			{ name: "Användning", value: usages }
		]
		if (cmd.notes) {
			let notes = cmd.notes.join("\n");
			if (notes) {
				fields.push({ name: "Notera!", value: notes });
			}
		}
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`${cmd.name} - Help`)
			.setDescription(`Visar information om kommandot *${cmd.name}*.`)
			.addFields(
				fields
			)
		return embed;
	}
}