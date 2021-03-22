const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");

module.exports = {
	name: "me",
	aliases: ["myinfo"],
	description: "Print information about user!",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
		const configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		message.channel.send(`${configData.prefix}me har flyttats till ${configData.prefix}memberinfo`);
	}
}