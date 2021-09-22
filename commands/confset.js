const configModel = require("../models/configSchema");
const functions = require("../functions");
const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	name: "confset",
	aliases: ["configset", "setconf"],
	description: "Ändra config-variablers värde.",
	usage: [
		"confset <variable> <value>"
	],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("confset")
		.setDescription("Ändra config-variablers värde.")
		.addStringOption((option) =>{
			return option.setName("key").setDescription("Angen en key").setRequired(true)
		})
		.addStringOption((option) =>{
			return option.setName("value").setDescription("Ange vilet värde keyn ska ändra till").setRequired(true)
		}),
	async do(message, args, profileData,isInteraction) {
		if(!isInteraction){
			if (!args[0]) return message.channel.send("Du måste ange vilken key du vill ändra.")
			if (!args[1]) return message.channel.send("Du måste ange vilket värde key'n ska sättas till!")
		}
		else {
			args[0] = message.options._hoistedOptions[0].value;
			args[1] = message.options._hoistedOptions[1].value;
		}

		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		configData[args[0]] = JSON.parse(args.slice(1, args.length).join(" "));
		await configData.save();
		if(!isInteraction) message.channel.send(`Set "${args[0]}" value to "${configData[args[0]]}"`);
		else message.reply(`Set "${args[0]}" value to "${configData[args[0]]}"`)

		functions.applyOptions(message.client, configData);
	}
}