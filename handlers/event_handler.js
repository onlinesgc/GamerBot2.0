const fs = require("fs");
const Discord = require("discord.js");

module.exports = (client) => {
	const load_dir = (dirs) => {
		const event_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith(".js"));
		for (const file of event_files) {
			const event = require(`../events/${dirs}/${file}`);
			const event_name = file.split(".")[0];
			console.log(event_name);
			client.on(event_name, (...args) => event(...args, client));
		}
	}
	["client", "guild"].forEach(e => load_dir(e));
}