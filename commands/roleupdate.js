const profileModel = require("../models/profileSchema");
const ms = require("ms");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");

module.exports = {
	name: "roleupdate",
	aliases: [],
	description: "Uppdatera roller för en enskild användare",
	usage: [
		".roleupdate <memberid>",
		".roleupdate <membertag>",
	],
	notes: [],
	perms: ["adminCmd"],
	async do(message, args, profileData) {

		//Retreive options
		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		let member;
		let user;
		if (!args[0]) {
			return message.channel.send("Du måste ange vilken användare du vill uppdatera roller för.");
		} else {
			if (message.mentions.members.first()) {
				member = message.mentions.members.first();
				user = message.mentions.users.first();
			} else {
				member = await message.guild.members.fetch(args[0]);
				user = await message.client.users.fetch(args[0]);
			}
		}
		let profile_data = await profileModel.fetchProfile(member.id, message.guild.id);		//Fetch profile
		//Update level
		configData.xp.levels.forEach(element => {		//Remove all level roles
			member.roles.remove(message.guild.roles.cache.get(element.id));
		});
		//Adding find correct role
		for (let index = 0; index < configData.xp.levels.length; index++) {
			const role = configData.xp.levels[index];
			//nextRoleLevel allows for testing within span, and if statement helps in end of list.
			let nextRoleLevel = 0;
			if (index === configData.xp.levels.length-1) {
				nextRoleLevel = 100000000;
			} else {
				nextRoleLevel = configData.xp.levels[index+1].level;
			}
			//Actually adding roles
			if (profile_data.level >= role.level+1 && profile_data.level < nextRoleLevel+1) {
				member.roles.add(message.guild.roles.cache.get(role.id));
				message.channel.send("Added role: " + message.guild.roles.cache.get(role.id).name + ". To member: " + member.user.username);
			}
		}
	}
}
