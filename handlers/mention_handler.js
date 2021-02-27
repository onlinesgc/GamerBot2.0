const fs = require("fs");

module.exports = (client, Discord) => {
	const mention_files = fs.readdirSync(`./commands/on_mention/`).filter(file => file.endsWith(".js"));
	for (const file of mention_files) {
		const mention_command = require(`../commands/on_mention/${file}`);
		if (mention_command.name) {
			client.mention_commands.set(mention_command.name, mention_command);
		} else {
			console.log("Mention command Name error!");
		}
	}
}