const fs = require("fs");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9")
const guildId = "813844220694757447";
const clientId = "838113165576634400";

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
	const rest = new REST({
		version:"9"
	}).setToken(process.env.token);

	(async () =>{
		try {
			console.log("start to fix commands")
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId), {
					body: client.commandArray
				}
			)
			console.log("Fixed all commands")
		}
		catch(err){
			console.log(err);
		}
	})(); 
}