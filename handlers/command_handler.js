const fs = require("fs");

module.exports = (client) => {
	client.commandArray = [];
	const command_files = fs.readdirSync(`./commands/`).filter(file => file.endsWith(".js"));
	for (const file of command_files) {
		const command = require(`../commands/${file}`);
		if (command.name) {
			client.commands.set(command.name, command);
			if(command.data != undefined) client.commandArray.push(command.data.toJSON())
		} else {
			console.log("Command Name error!");
		}
	}
}