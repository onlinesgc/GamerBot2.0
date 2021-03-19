const profileModel = require("../models/profileSchema");
const ms = require("ms");
const Discord = require('discord.js');
const configModel = require("../models/configSchema");

module.exports = {
	name: "setxp",
	aliases: [],
	description: "Sätt xp, xp timeout eller level för en användare!",
	usage: [
		"setxp {<mentionedUser>|<userID>} -x <xpAmount>",
		"setxp {<mentionedUser>|<userID>} -t <xpTimeout>",
		"setxp {<mentionedUser>|<userID>} -l <level>"
	],
	notes: [
		"*xpTimeout* mäts som standard i millisekunder från att du skickar detta kommando. Du kan också specificera värdet genom att sätta \`h\`, \`s\`, \`m\` etc. bakom. Exempel:\n\`60s\`, \`8h\` och \`2w\`"
	],
	perms: ["adminCmd"],
	async do(message, args, profileData) {

		//Retreive options
		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		let member;
		let user;
		if (!args[0]) {
			return message.channel.send("Du måste ange vilken användare du vill sätta xp'n för.");
		} else {
			if (message.mentions.members.first()) {
				member = message.mentions.members.first();
				user = message.mentions.users.first();
			} else {
				member = await message.guild.members.fetch(args[0]);
				user = await client.users.fetch(args[0]);
			}
		}
		if (!args[1]) return message.channel.send("Du måste ange minst en operation du vill utföra!");
		let profile_data = await profileModel.fetchProfile(member.id, message.guild.id);		//Fetch profile
		let fields = [];
		let completedOperations = [];
		for (let index = 1; index < args.length; index++) {
			if (args[index] === "-x") {
				if (completedOperations.includes("-x")) {
					index++;
					continue;
				}
				if (!args[index + 1]) return message.channel.send("Du måste berätta Xp-värdet för mig. Annars blir det lite krångligt...");
				if (isNaN(args[index + 1])) {
					return message.channel.send("Xp-värdet måste vara ett nummer!");
				} else {
					profile_data.xp = args[index + 1];
					fields.push({
						name: "XP",
						value: `Sätt ${member}'s xp till ${profile_data.xp}!`
					});
				}
				completedOperations.push("-x")
				index++;
			} else if (args[index] === "-t") {
				if (completedOperations.includes("-t")) {
					index++;
					continue;
				}
				if (!args[index + 1]) return message.channel.send("Ett värde för Xp-timeouten måste tillhandahållas.");
				if (ms(args[index + 1]) == undefined) {
					return message.channel.send("Xp-timeouten måste kunna omvandlas till millisekunder!");
				} else {
					profile_data.xpTimeoutUntil = message.createdTimestamp + ms(args[index + 1]);
					fields.push({
						name: "XP Timeout",
						value: `Sätt ${member}'s xp timeout till ${profile_data.xpTimeoutUntil}!`
					});
				}
				completedOperations.push("-t")
				index++;
			} else if (args[index] === "-l") {
				if (completedOperations.includes("-l")) {
					index++;
					continue;
				}
				if (!args[index + 1]) return message.channel.send("Ett värde för leveln måste tillhandahållas.");
				if (isNaN(args[index + 1])) {
					return message.channel.send("Leveln måste vara ett nummer!");
				} else {
					profile_data.level = parseInt(args[index + 1]) + 1;
					
					//Update level
					configData.xp.levels.forEach(element => {		//Remove all level roles
						member.roles.remove(message.guild.roles.cache.get(element));
					});
					for (let index = 0; index < configData.xp.levels.length; index++) {
						const element = configData.xp.levels[index];
						if (profile_data.level - 2 === index) {
							member.roles.add(message.guild.roles.cache.get(element));
						}
					}
					// member.roles.add(message.guild.roles.cache.get(configData.xp.levels[profile_data.level - 2])).catch((err) => {
					// 	console.log(`Failed to add level role to user: ${member.user.tag}. He/She is at level ${profile_data.level - 1}`);
					// 	console.log(`Errormessage: ${err}`);
					// });

					profile_data.xp = 0;
					fields.push({
						name: "Level",
						value: `Sätt ${member}'s level till ${profile_data.level - 1}!`
					});
				}
				completedOperations.push("-l")
				index++;
			} else if (!completedOperations.includes(args[index])) {
				completedOperations.push(args[index]);
			}
		}
		for (let operation of completedOperations) {
			if ((operation !== "-x") && (operation !== "-t") && (operation !== "-l")) {
				return message.channel.send(`Du specificerade operationen ${operation} som inte finns. Använd help-kommandot för att se användningen av det här kommandot samt de tillgängliga operationerna.`);
			}
		}
		profile_data.save()
		
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Set xp`)
			.addFields(
				fields
			)
		message.channel.send(embed);
	}
}