const profileModel = require("../models/profileSchema");
const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "me",
	aliases: ["userinfo", "myinfo", "memberinfo"],
	description: "Get member information for message author, or specified user",
	usage: [],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("me")
		.setDescription("Get member information for message author, or specified user")
		.addUserOption((option) => {
			return option.setName("user").setDescription("This is used to fetch another user").setRequired(false)
		})
		.addBooleanOption((option) => {
			return option.setName("options").setDescription("This is an admin command").setRequired(false);
		}),
	async do(message, args, profileData, isInteraction) {
		let member;
		let configData = await configModel.fetchConfig(process.env.config_id);
		let override = false;
		let options = false;

		//Parse input .memberinfo -o or .memberinfo <argument> -o
		//.Commands
		if (args[0] === "-o") {
			profileData = await profileModel.fetchProfileFromMessage(message);
			if (message.member.permissions.has("ADMINISTRATOR")) {
				override = true;
			}

		}
		else if (args[0] != undefined) {
			if (message.mentions.members.first()) {
				member = await message.mentions.members.first();
			} else {
				try{
					member = await message.guild.members.fetch(args[0]);
				}
				catch(err){
					if (isInteraction) return message.reply("Det är inte en person. Testa att skriva ID istälet eller använde @");
					else message.channel.send("Det är inte en person. Testa att skriva ID istälet eller använde @")
				}
			}
			profileData = await profileModel.fetchProfile(member.id, message.guild.id);
			options = true;
			if ((args[1] === "-o") && (message.member.permissions.has("ADMINISTRATOR"))) {
				override = true;
			}

		}
		//end of .commands
		//start with "/" commands
		if (message.options != undefined) {
			if (message.options._hoistedOptions[0] != undefined) {

				if (message.options._hoistedOptions[0].type == "USER") {
					member = message.options._hoistedOptions[0].member;
					profileData = await profileModel.fetchProfile(member.id, message.guild.id);
					options = true;
					if (message.options._hoistedOptions[1] != undefined) {
						if (message.options._hoistedOptions[1].type == "BOOLEAN") {
							if (message.options._hoistedOptions[0].value) {
								if (message.member.permissions.has("ADMINISTRATOR")) {
									override = true;
								}
							}
						}
					}
				}
				if (message.options._hoistedOptions[0].type == "BOOLEAN") {
					if (message.options._hoistedOptions[0].value) {
						profileData = await profileModel.fetchProfileFromInteraction(message);
						if (message.member.permissions.has("ADMINISTRATOR")) {
							override = true;
						}
					}
				}
			}
		}
		//end of slach command 
		//Generate image
		let TimeOut = "";
		let Xp = "";
		if (profileData.profileFrame == undefined) {
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
		if (!options) {
			if (profileData.profileFrame >= 0) {
				if (isInteraction) message.reply({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, message.member.user.avatarURL({ format: "png" }), message.member.user.username, profileData.profileFrame)] })
				else message.channel.send({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, message.author.avatarURL({ format: "png" }), message.author.username, profileData.profileFrame)] });
			}
			else{
				if (isInteraction) message.reply({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, message.member.user.avatarURL({ format: "png" }), message.member.user.username, profileData.profileFrame,true)],name:"frame.gif"})
				else message.channel.send({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, message.author.avatarURL({ format: "png" }), message.author.username, profileData.profileFrame,true)],name:"frame.gif"});
			}
		}
		else {
			if (profileData.profileFrame >= 0) {
				if (isInteraction) message.reply({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, member.user.avatarURL({ format: "png" }), member.user.username, profileData.profileFrame)] })
				else message.channel.send({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, member.user.avatarURL({ format: "png" }), member.user.username, profileData.profileFrame)] });
			}
			else{
				if (isInteraction) message.reply({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, member.user.avatarURL({ format: "png" }), member.user.username, profileData.profileFrame,true)], name:"frame.gif"})
				else message.channel.send({ files: [await functions.getProfilePotho(profileData, TimeOut, Xp, xpPercentage, member.user.avatarURL({ format: "png" }), member.user.username, profileData.profileFrame,true)],name:"frame.gif"});
			}
		}
	}
}
