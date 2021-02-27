const configModel = require("../models/configSchema");

module.exports = {
	name: "confset",
	aliases: [],
	description: "Change config options!",
	usage: [],
	perms: ["adminCmd"],
	async do(client, message, args, Discord) {
		if (!args[0]) return message.channel.send("Du måste ange vilken key du vill ändra.")
		if (!args[1]) return message.channel.send("Du måste ange vilket värde key'n ska sättas till!")

		//Retreive options
		configData = await configModel.findOne({ id: 0 });
		if (!configData) {
			let config = await configModel.create({
				prefix: ".",
				id: 0
			});
			config.save();
		}

		configData[args[0]] = args[1];
		configData.save();
		message.channel.send(`Set "${args[0]}" value to "${args[1]}"`);
	}
}