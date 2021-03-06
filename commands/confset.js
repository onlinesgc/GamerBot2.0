const configModel = require("../models/configSchema");
const functions = require("../functions");

module.exports = {
	name: "confset",
	aliases: [],
	description: "Change config options!",
	usage: [],
	perms: ["adminCmd"],
	async do(client, message, args, Discord) {
		if (!args[0]) return message.channel.send("Du måste ange vilken key du vill ändra.")
		if (!args[1]) return message.channel.send("Du måste ange vilket värde key'n ska sättas till!")

		let configData = await configModel.fetchConfig(0);		//Retreive options

		configData[args[0]] = args.slice(1, args.length).join(" ");
		configData.save();
		message.channel.send(`Set "${args[0]}" value to "${configData[args[0]]}"`);

		functions.applyOptions(client, configData);
	}
}