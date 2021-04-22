const Discord = require('discord.js');
const ms = require("ms");

module.exports = {
	name: "remind",
	aliases: ["remindme"],
	description: "Ställ in en påminnelse!",
	usage: ["remind <time> <message>"],
	notes: [
		"Det är inte rekommenderat att sätta en hög tid då påminnelsen tas bort efter bot-omstart."
	],
	perms: [],
	async do(message, args, profileData) {
		if (!args[0]) return message.channel.send("Du måste sätta en tid för påminnelsen!");

		let timeout = 0;
		let array = args[0].split("-");
		array.forEach(element => {
			if (ms(element) == undefined) return message.channel.send("Tiden måste kunna omvandlas till millisekunder!");
			timeout += ms(element);
		});

		//Determine if user specified a message or not
		let msg;
		if (args[1]) {
			msg = args[1];
		} else {
			msg = "Inget meddelande angivet."
		}

		//Add reminder to database
		let remindTimestamp = Date.now() + timeout;
		let remindTime = new Date(remindTimestamp);
		profileData.reminders.push({
			remindTimestamp: remindTimestamp,
			message: msg
		});
		await profileData.save();

		message.channel.send(`Jag påminner dig om \`${ms(timeout)}\` eller \`${remindTime}\``);

		setTimeout(() => {
			const embed = new Discord.MessageEmbed()
				.setColor("#f54242")
				.setTitle(`Påminnelse`)
				.setDescription(msg)
			message.author.send(embed)
		}, timeout)
	}
}