const profileModel = require("../models/profileSchema");
const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");

module.exports = {
    name: "memberinfo",
    aliases: ["userinfo", "myinfo","me"],
    description: "Get member information for message author, or specified user",
    usage: [],
    perms: [],
    async do(message, args, profileData) {
		let member;
		let configData = await configModel.fetchConfig(process.env.config_id);
		let override = false;
		let options = false;

		//Parse input .memberinfo -o or .memberinfo <argument> -o
		if (args[0] === "-o") {
			profileData = await profileModel.fetchProfileFromMessage(message);
			if (message.member.permissions.has("ADMINISTRATOR")) {
				override = true;
			}
		
		} 
		else if(args[0] != undefined) {
			if (message.mentions.members.first()) {
				member = await message.mentions.members.first();
			} else {
				member = await message.guild.members.fetch(args[0]);
			}
			profileData = await profileModel.fetchProfile(member.id, message.guild.id);
			options = true;
			if ((args[1] === "-o") && (message.member.permissions.has("ADMINISTRATOR"))) {
				override = true;
			}

		}

		//Generate image
		let TimeOut = "";
		let Xp = "";
		if(profileData.profileFrame == undefined){
			profileData.profileFrame = 0;
			await profileData.save()
		}
		if ((!configData.xp.xpHidden) || (override)) {
			Xp += "XP: " + profileData.xp;
		}
		if (((profileData.xpTimeoutUntil - message.createdTimestamp > 0) && (!configData.xp.xpTimeoutHidden)) || (override)) {
			TimeOut += "XP Timeout: " + functions.msToString(profileData.xpTimeoutUntil - message.createdTimestamp);
		}
		let xpPercentage = Math.round(profileData.xp / Math.pow(profileData.level + configData.xp.levelBaseOffset, configData.xp.levelExponent) * 100);
		if(!options){
			message.channel.send({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, message.author.avatarURL({format:"png"}), message.author.username,profileData.profileFrame) ]});
		}
		else{
			message.channel.send({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, member.user.avatarURL({format:"png"}), member.user.username,profileData.profileFrame)]});
		}
		}
	}
