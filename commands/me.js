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

		let override = false;
		if (args[0]) {
			if ((args[0] === "-o") && (message.member.hasPermission("ADMINISTRATOR"))) {
				override = true;
			}
		}

		let fields = [];
		if ((!configData.xp.xpHidden) || (override)) {
			fields.push({ name: "XP", value: profileData.xp, inline: true });
		}
		if (((profileData.xpTimeoutUntil - message.createdTimestamp > 0) && (!configData.xp.xpTimeoutHidden)) || (override)) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profileData.xpTimeoutUntil - message.createdTimestamp), inline: true });
		}

		let xpPercentage;
		if (profileData.xp < 0) {
			xpPercentage = 0;
		} else {
			xpPercentage = Math.round(profileData.xp / Math.pow(profileData.level + configData.xp.levelBaseOffset, configData.xp.levelExponent) * 100);
		}
		let progressBar = "█".repeat(Math.round(xpPercentage / 10)) + "░".repeat(Math.round((100 - xpPercentage) / 10));
		
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Användarinfo`)
			.setDescription(`${message.member}'s information.`)
			.setImage(message.author.avatarURL())
			.addFields(
				fields,
				{ name: "Level", value: profileData.level - 1, inline: true },
				{ name: "Progress", value: `${progressBar} ${xpPercentage}%` },
				{ name: "id", value: message.author.id }
			)
		message.channel.send(embed);
	}
}