const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");
const {createCanvas, loadImage, registerFont} = require("canvas");
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

		let fields = [];
		if ((!configData.xp.xpHidden) || (override)) {
			fields.push({ name: "XP", value: profileData.xp, inline: true });
		}
		if (((profileData.xpTimeoutUntil - message.createdTimestamp > 0) && (!configData.xp.xpTimeoutHidden)) || (override)) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profileData.xpTimeoutUntil - message.createdTimestamp), inline: true });
		}

		let xpPercentage = Math.round(profileData.xp / Math.pow(profileData.level + configData.xp.levelBaseOffset, configData.xp.levelExponent) * 100);
		let progressBar = "█".repeat(Math.round(xpPercentage / 10)) + "░".repeat(Math.round((100 - xpPercentage) / 10));

		var whidth = 500;
        var hight = 800;
		registerFont("./canvas/Hard Compound.ttf",{family:"Hard_Compound"});
        const Profile = createCanvas(whidth,hight);
        const ProfileOptions = Profile.getContext("2d");
        ProfileOptions.fillStyle = '#4A4E48';
        ProfileOptions.fillRect(0,0,whidth,hight);
        await loadImage(message.author.avatarURL({format:"png"})).then(img =>{
			ProfileOptions.fillStyle = "#5FDA18";
			ProfileOptions.fillRect((whidth/2)-135,70,270,270)
            ProfileOptions.drawImage(img,(whidth/2) - 125,80,250,250);
        })
        ProfileOptions.font = "bold 50pt Hard_Compound"
        ProfileOptions.textAlign = "center"
        ProfileOptions.fillStyle = "#fff"
        ProfileOptions.fillText(message.author.username,(whidth/2), 400)
		ProfileOptions.font = "normal 40pt Hard_Compound"
		ProfileOptions.fillText(`Level: ${profileData.level-1}`,(whidth/2),500);
		//ProfileOptions.font = "normal 30pt sans"
		//ProfileOptions.fillText(`Progress:\n${progressBar} ${xpPercentage}%`,(whidth/2),630);
		var multiplier = 3.5;
		var fildBar = 100 * multiplier;
		var Bar = xpPercentage * multiplier;
		ProfileOptions.fillStyle = "#898C87"
		ProfileOptions.fillRect(70,550,fildBar,40);
		ProfileOptions.fillStyle = "#fff"
		ProfileOptions.fillRect(70,550,Bar,40);
		ProfileOptions.font = "normal 40pt Hard_Compound";
		ProfileOptions.fillText(`${xpPercentage}%`,(whidth/2),645);
		await loadImage("./canvas/BackrundsFrame.png").then(img =>{
            ProfileOptions.drawImage(img,0,0,whidth,hight);
        })
        const buffer = Profile.toBuffer("image/png");
        await fs.writeFileSync("./canvas/Temp.png",buffer);
		/*
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
		*/
		message.channel.send({files:["./canvas/Temp.png"]});
	}
}
