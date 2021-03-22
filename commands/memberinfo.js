const dayjs = require("dayjs");
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

		let fields = [
			{ name: "ID", value: profile_data.userID, inline: true },
			{ name: "Smeknamn", value: member.nickname ? member.nickname : "None", inline: true },
			{ name: "Level", value: profile_data.level - 1, inline: true },
			{ name: "Gick med", value: dayjs(member.joinedTimestamp).format("dddd, MMMM D YYYY, H:mm:ss"), inline: false }
		];

		if (((profile_data.xpTimeoutUntil - message.createdTimestamp > 0) && (!configData.xp.xpTimeoutHidden)) || (override)) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profile_data.xpTimeoutUntil - message.createdTimestamp), inline: true });
		}

		if ((!configData.xp.xpHidden) || (override)) {
			fields.push({ name: "XP", value: profile_data.xp, inline: true });
		}

		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Information om medlem`)
			.setDescription(`${member}'s information.`)
			.setThumbnail(member.user.displayAvatarURL())
			.addFields(fields)

		message.channel.send(embed);
	}
}