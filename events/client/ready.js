const profileModel = require("../../models/profileSchema");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const configModel = require("../../models/configSchema");
const functions = require("../../functions");

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const guildId = "813844220694757447";

module.exports = (client) => {
	console.log(`${client.user.username} is online! Hosting ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

	mongoose.connect(process.env.mongodb_srv, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(async () => {
		console.log("Connected to the database!");

		let profiles = await profileModel.fetchAll({ reminders: { $exists: true, $not: { $size: 0 } } });
		profiles.forEach((profile, i) => {
			profile.reminders.forEach(async (reminder, j) => {
				let timeout = reminder.remindTimestamp - Date.now();
				if (timeout > 0 && timeout < 2147483637) {
					setTimeout(() => {
						const embed = new Discord.MessageEmbed()
							.setColor("#f54242")
							.setTitle(`Påminnelse`)
							.setDescription(reminder.message)
						client.users.fetch(profile.userID).then(user => {
							user.send(embed);
						});
					}, timeout);
				} else {
					profile.reminders.splice(j, 1);		//Remove old reminder

					await profileModel.profileModel.findByIdAndUpdate(profile._id, profile);
				}
			});
		});
		console.log("Resumed reminders!");

		//Retreive options
		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options
		console.log("Options retrieved!");

		//Apply options
		functions.applyOptions(client, configData);
		console.log("Options applied!");

		//Register slash commands
		const rest = new REST({
			version: "9"
		}).setToken(process.env.token);
		(async () => {
			try {
				console.log("Start to fix commands...")
				await rest.put(
					Routes.applicationGuildCommands(await configModel.fetchConfig(process.env.config_id).id, guildId), {
					body: client.commandArray
				}
				)
				console.log("Fixed all commands!")
			} catch (err) {
				console.log(err);
			}
		});

	}).catch((err) => {
		console.log(process.env.mongodb_srv);
		console.log(err);
	});


	functions.ReloadVids(client); //Starts an interval that looks for new vids. 
}