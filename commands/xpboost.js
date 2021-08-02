const profileModel = require("../models/profileSchema");
const functions = require("../functions");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");

module.exports = {
	name: "xpboost",
	aliases: ["boostxp"],
	description: "Boosta xp per meddelande för en användare", //Or role
	usage: [
		"xpboost {<mentionedUser>|<userID>} <multiplier> <stopBoostDate>"
	],
	perms: ["adminCmd"],
	async do(message, args) {

		let member;
		let user;
		if (!args[0]) {
			return message.channel.send("Du måste ange vilken användare du vill xpboosta.");
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

		if (!args[1]) return message.channel.send("Du måste ange hur mycket xp'n ska multipliceras med.");
		if (!args[2]) return message.channel.send("Du måste ange när xpboosten slutar.");

		let c;
		let stopBoostTimestamp;
		if (args[2] == -1) {
			stopBoostTimestamp = -1;		// -1 equals infinite boost
		} else if (!args[3]) {
			return message.channel.send("Du måste ange vilken tid på dygnet xpboosten slutar.");
		} else {
			const a = args[2].split("-", 3);
			const b = args[3].split(":", 3);
			if (!b[2]) b.push(0);
			c = new Date(a[0], a[1]-1, a[2], b[0], b[1], b[2], 0);
			stopBoostTimestamp = c.getTime();
		}

		profile_data.xpboost = {
			multiplier: parseInt(args[1]),
			stopBoostTimestamp: stopBoostTimestamp
		};
		profile_data.save();

		if (profile_data.xpboost.stopBoostTimestamp === -1) {
			message.channel.send(`Varje gång ${member} får xp kommer jag multiplicera det med \`${args[1]}\`. XP-boosten varar tills du stänger av den.`);
		} else {
			message.channel.send(`Varje gång ${member} får xp kommer jag multiplicera det med \`${args[1]}\`. XP-boosten slutar den \`${c}\``);
		}
	}
}