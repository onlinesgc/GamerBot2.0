const configModel = require("../models/configSchema");
const Discord = require('discord.js');
const profileModel = require"../models/profileSchema");

module.exports = {
	name: "roleupdate",
	aliases: ["updateroles", "update-server-roles"],
	description: "Uppdatera servermedlemmars rollinnehav, baserat på deras nuvarande level.",
	usage: [
		"updateroles",
	],
	perms: ["adminCmd"],
	async do(message, args, profileData) {
		//Get bot options
		let configJSON = await configModel.fetchConfig(process.env.config_id);

		let configData = JSON.parse(JSON.stringify(configJSON));
		configData.id = undefined;
		configData._id = undefined;
		configData.__v = undefined;
		//Get all members for guild where message was sent. (Requires Priviliged Gateway Intent being checked in bot settings on discord developer portal.	
		message.guild.members.fetch()
		.then(members => {members.forEach(member =>
			{
				//Remove roles for current.
				console.log(member.user.id);
			}
		)})
		.catch(console.error);
	}
}
