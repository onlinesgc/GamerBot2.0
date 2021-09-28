const configModel = require("../models/configSchema");
const Discord = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "confget",
	aliases: ["configget", "getconf"],
	description: "Skicka värdet av config-variabler.",
	usage: [
		"confget",
		"confget <variable>"
	],
	perms: ["adminCmd"],
	data: new SlashCommandBuilder()
		.setName("confget")
		.setDescription("Skicka värdet av config-variabler.")
		.addStringOption((option) => {
			return option.setName("key").setDescription("get the key you want from the conf").setRequired(false)
		}),
	async do(message, args, profileData, isInteraction) {

		//Retreive options
		let configDataRaw = await configModel.fetchConfig(process.env.config_id);		//Retreive options

		let configDataParsed = JSON.parse(JSON.stringify(configDataRaw));
		delete configDataParsed.id;
		delete configDataParsed._id;
		delete configDataParsed.__v;

		if (isInteraction) {
			if (message.options._hoistedOptions[0] != null) args[0] = message.options._hoistedOptions[0].value;
		}

		if (args[0]) {
			if (configDataParsed[args[0]] == undefined) {
				if (!isInteraction) return message.channel.send(`Config-variabeln "${args[0]}" är odefinierad.`);
				else return message.reply(`Config-variabeln "${args[0]}" är odefinierad.`);
			}
			const embed = new Discord.MessageEmbed()
				.setColor("#f54242")
				.setTitle(`${args[0]} - Config`)
				.setDescription(`Visar värdet av config-variabeln *${args[0]}*.`)
				.addFields(
					{ name: "Värde:", value: `\`\`\`json\n${JSON.stringify(configDataParsed[args[0]], null, 4)}\`\`\`` }
				)
			if (!isInteraction) return message.channel.send({ embeds: [embed] });
			else return message.reply({ embeds: [embed] });
		} else {
			var settingsList = "";
			Object.keys(configDataParsed).forEach(setting => {
				settingsList = settingsList + setting + "\n";
			})

			const embed = new Discord.MessageEmbed()
				.setColor("#f54242")
				.setTitle(`Config`)
				.setDescription(`Du måste välja en config kategori under efter huvudkommandot. Dessa kategorier finns:`)
				.addFields(
					{ name: "Konfiguration:", value: settingsList },
					{ name: "ID:", value: `Den här boten använder konfigurationsdokumentet med id \`${configDataRaw.id}\`.` }
				)
			if (!isInteraction) return message.channel.send({ embeds: [embed] });
			else return message.reply({ embeds: [embed] });
		}
	}
}