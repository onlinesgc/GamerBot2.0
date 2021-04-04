const { Log } = require("../../logSystem");

module.exports = (client) => {
	console.log(`${client.user.username} is online! Hosting ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

	Log.configure(
		client,
		"828277880362500138"
	)
	Log.error("Test");
}