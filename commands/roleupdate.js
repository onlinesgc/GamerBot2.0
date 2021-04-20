const configModel = require("../models/configSchema");
const Discord = require('discord.js');
const profileModel = require("../models/profileSchema");

module.exports = {
	name: "roleupdate",
	aliases: ["updateroles", "update-server-roles"],
	description: "Uppdatera servermedlemmars rollinnehav, baserat på deras nuvarande level.",
	usage: [
		".roleupdate",
	],
	perms: ["adminCmd"],
	async do(message, args) {
		//Get bot optionsi and user data
		let configData = await configModel.fetchConfig(process.env.config_id);

		await message.guild.members.fetch().then(members => {
			members.forEach(async user => {

				configData.xp.levels.forEach(role => {		//Remove XP related roles
					user.roles.remove(message.guild.roles.cache.get(role.id));
				});
				
				let profileData = await profileModel.fetchProfile(user.id, message.guild.id);

				//Add new level roles adjused for new XP config.
				for (let index = 0; index < configData.xp.levels.length; index++) {
					const role = configData.xp.levels[index];
					//nextRoleLevel allows for testing within span, and if statement helps in end of list.
					let nextRoleLevel = 0;
					if (index === configData.xp.levels.length-1) {
						nextRoleLevel = 10000000;
					} else {
						nextRoleLevel = configData.xp.levels[index+1].level;
					}
					//Actually testing level and adding roles.
					if (profileData.level >= role.level+1 && profileData.level < nextRoleLevel+1) {
						user.roles.add(message.guild.roles.cache.get(role.id));
					}
				}
			})
		}).catch(console.error);
		message.channel.send("Successfully updated member roles!");
	}
}
