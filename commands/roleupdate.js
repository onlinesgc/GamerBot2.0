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
		let profileData = await profileModel.fetchAll();

		//Get all members for guild where message was sent. (Requires Priviliged Gateway Intent being checked in bot settings on discord developer portal.	
		message.guild.members.fetch()
		.then(members => {members.forEach(member =>
			{
				//Remove level roles for current user.
				let memberID = member.user.id;
				
				//Remove XP related roles from user.
				configData.xp.levels.forEach(role => 
					{
						member.roles.remove(message.guild.roles.cache.get(role.id));
				});

				//Look up current user in database
				let profileIndex = 0;
				while (memberID != profileData[profileIndex].userID) {
					profileIndex++;
				} 	

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
					if (profileData[profileIndex].level >= role.level+1 && profileData[profileIndex].level < nextRoleLevel+1) {
						member.roles.add(message.guild.roles.cache.get(role.id));
					}
				}

			}
		)})
		.catch(console.error);
		message.channel.send("Successfully updated member roles!");

	}
}
