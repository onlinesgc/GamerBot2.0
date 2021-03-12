const configModel = require("../models/configSchema");
const functions = require("../functions");

module.exports = {
	name: "confset",
	aliases: ["configset"],
	description: "Ändra config-variablers värde.",
	usage: [
		"confset <variable> <value>"
	],
	perms: ["adminCmd"],
	async do(message, args, profileData) {
		if (!args[0]) return message.channel.send("Du måste ange vilken key du vill ändra.")
		if (!args[1]) return message.channel.send("Du måste ange vilket värde key'n ska sättas till!")

		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		configData[args[0]] = JSON.parse(args.slice(1, args.length).join(" "));
		configData.save();
		message.channel.send(`Set "${args[0]}" value to "${configData[args[0]]}"`);

		functions.applyOptions(message.client, configData);
	}
}