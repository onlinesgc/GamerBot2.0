const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");
const fs = require("fs");

module.exports = {
	name: "me",
	aliases: ["myinfo"],
	description: "Print information about user!",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
		const configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		let override = false;
		if (args[0]) {
			if ((args[0] === "-o") && (message.member.hasPermission("ADMINISTRATOR"))) {
				override = true;
			}
		}
		let TimeOut = "";
		let Xp = "";
		if ((!configData.xp.xpHidden) || (override)) {
			Xp += "XP: "+profileData.xp;
		}
		if (((profileData.xpTimeoutUntil - message.createdTimestamp > 0) && (!configData.xp.xpTimeoutHidden)) || (override)) {
			TimeOut += "XP Timeout: " + functions.msToString(profileData.xpTimeoutUntil - message.createdTimestamp);
		}
		let xpPercentage = Math.round(profileData.xp / Math.pow(profileData.level + configData.xp.levelBaseOffset, configData.xp.levelExponent) * 100);
		message.channel.send({files:[await functions.getProfilePotho(profileData,TimeOut,Xp,xpPercentage,message)]});
	}
}
