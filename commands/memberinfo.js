const profileModel = require("../models/profileSchema");
const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");

module.exports = {
	name: "memberinfo",
	aliases: ["userinfo"],
	description: "Get member information for specified user!",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
		let member;
		let user;
		if (!args[0]) {
			return message.channel.send("Du måste ange vilken användare du vill veta mer information om!")
		} else {
			if (message.mentions.members.first()) {
				member = message.mentions.members.first();
				user = message.mentions.users.first();
			} else {
				member = await message.guild.members.fetch(args[0]);
				user = await message.client.users.fetch(args[0]);
			}
		}

		let override = false;
		if (args[1]) {
			if ((args[1] === "-o") && (message.member.hasPermission("ADMINISTRATOR"))) {
				override = true;
			}
		}

		const profile_data = await profileModel.fetchProfile(member.id, message.guild.id);		//Fetch profile
		const configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		let fields = [];
		if ((!configData.xp.xpHidden) || (override)) {
			fields.push({ name: "XP", value: profile_data.xp, inline: true });
		}
		if (((profile_data.xpTimeoutUntil - message.createdTimestamp > 0) && (!configData.xp.xpTimeoutHidden)) || (override)) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profile_data.xpTimeoutUntil - message.createdTimestamp), inline: true });
		}
		let xpPercentage = Math.round(profileData.xp / Math.pow(profileData.level + configData.xp.levelBaseOffset, configData.xp.levelExponent) * 100);
		let progressBar = "█".repeat(Math.round(xpPercentage / 10)) + "░".repeat(Math.round((100 - xpPercentage) / 10));
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Information om medlem`)
			.setDescription(`${member}'s information.`)
			.setImage(user.avatarURL())
			.addFields(
				fields,
				{ name: "Level", value: profile_data.level - 1, inline: true },
				{ name: "Progress", value: `${progressBar} ${xpPercentage}%` },
				{ name: "id", value: profile_data.userID }
			)
		message.channel.send(embed);
	}
}