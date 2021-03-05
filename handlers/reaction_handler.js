const fs = require("fs");

module.exports = (client, Discord) => {
	const reaction_files = fs.readdirSync(`./commands/on_reaction/`).filter(file => file.endsWith(".js"));
	for (const file of reaction_files) {
		const reaction_command = require(`../commands/on_reaction/${file}`);
		if (reaction_command.name) {
			client.reaction_actions.set(reaction_command.name, reaction_command);
		} else {
			console.log("Reaction command Name error!");
		}
	}
}