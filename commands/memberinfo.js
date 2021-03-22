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

		let override = false;

		if (!args[0] || args[0] === "-o") {
			member = message.member;
		} else {
			if (message.mentions.members.first()) {
				member = message.mentions.members.first();
			} else {
				member = await message.guild.members.fetch(args[0]);
			}
		}

		if ((args[0] === "-o" || args[1] === "-o") && (message.member.hasPermission("ADMINISTRATOR"))) {
			override = true;
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

		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Information om medlem`)
			.setDescription(`${member}'s information.`)
			.setImage(member.user.displayAvatarURL())
			.addFields(
				fields,
				{ name: "Level", value: profile_data.level - 1, inline: true },
				{ name: "id", value: profile_data.userID }
			)
		message.channel.send(embed);
	}
}