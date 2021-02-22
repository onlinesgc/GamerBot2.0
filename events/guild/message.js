module.exports = (Discord, client, message) => {
	var prefix = ".";

	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command = client.commands.get(cmd);
	if (command) {
		command.do(client, message, args, Discord);
	}
}