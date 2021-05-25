const profileModel = require("../models/profileSchema");
const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");

module.exports = {
    name: "memberinfo",
    aliases: ["userinfo", "myinfo"],
    description: "Get member information for message author, or specified user",
    usage: [],
    perms: [],
    async do(message, args) {
	let member;
	let profileData;
	let configData = await configModel.fetchConfig(process.env.config_id);
	let override = false;

	//Parse input .memberinfo -o or .memberinfo <argument> -o
	if (!args[0] || args[0] === "-o") {
	    profileData = await profileModel.fetchProfileFromMessage(message);
	    if (message.member.hasPermission("ADMINISTRATOR")) {
		override = true;
	    }
    
	} else {
	    
	    if (message.mentions.members.first()) {
		member = message.mentions.members.first();
	    } else {
		member = message.guild.members.fetch(args[0]);
	    }
	    profileData = await profileModel.fetchProfile(member.id, message.guild.id);
	    
	    if ((args[1] === "-o") && (message.member.hasPermission("ADMINISTRATOR"))) {
		override = true;
	    }

	}

	message.channel.send(profileData);

	//Generate image
	let TimeOut = "";
	let Xp = "";
	if ((!configData.xp.xpHidden) || (override)) {
	    Xp += "XP: " + profileData.xp;
	}
	if (((profileData.xpTimeoutUntil - message.createdTimestamp > 0) && (!configData.xp.xpTimeoutHidden)) || (override)) {
	    TimeOut += "XP Timeout: " + functions.msToString(profileData.xpTimeoutUntil - message.createdTimestamp);
	}
	let xpPercentage = Math.round(profileData.xp / Math.pow(profileData.level + configData.xp.levelBaseOffset, configData.xp.levelExponent) * 100);
	message.channel.send({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, message)]});
    }
}
