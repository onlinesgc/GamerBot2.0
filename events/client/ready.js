const profileModel = require("../../models/profileSchema");
const Discord = require("discord.js");

module.exports = async (client) => {
	console.log(`${client.user.username} is online! Hosting ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

	let profiles = await profileModel.fetchAll({ reminders: {$exists: true, $not: {$size: 0}} });
	profiles.forEach((profile, i) => {
		profile.reminders.forEach(async (reminder, j) => {
			let timeout = reminder.remindTimestamp - Date.now();
			if (timeout > 0) {
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
}