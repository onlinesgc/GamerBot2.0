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

		let time = 0;
		let array = args[0].split("-");
		array.forEach(element => {
			if (ms(element) == undefined) return message.channel.send("Tiden måste kunna omvandlas till millisekunder!");
			time += ms(element);
		});

		message.channel.send(`Jag påminner dig om ${ms(time)}`);


		setTimeout(() => {
			let msg;
			if (args[1]) {
				msg = args[1];
			} else {
				msg = "Inget meddelande angivet."
			}
			const embed = new Discord.MessageEmbed()
				.setColor("#f54242")
				.setTitle(`Påminnelse`)
				.setDescription(msg)
			message.author.send(embed)
		}, time)
	}
}