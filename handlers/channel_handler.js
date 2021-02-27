const fs = require("fs");

module.exports = (client, Discord) => {
	const channel_files = fs.readdirSync(`./commands/channel_action/`).filter(file => file.endsWith(".js"));
	for (const file of channel_files) {
		const channel_action = require(`../commands/channel_action/${file}`);
		if (channel_action.name) {
			client.channel_actions.set(channel_action.name, channel_action);
		} else {
			console.log("Channel action error!");
		}
	}
}