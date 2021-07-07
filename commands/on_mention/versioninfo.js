const { exec, execSync } = require('child_process');
const Discord = require('discord.js');

module.exports = {
	name: "versioninfo",
	permittedMessages: ["vilken version"],
	description: "Gets the current bot version and branch!",
	perms: ["adminCmd"],
	async do(message) {
		let gitBranch = execSync("git branch --show-current", (err, stdout, stderr) => {
			if (err) {
				console.log(err);
				message.channel.send("Något gick fel. 🙁 Se konsolen!");
			}
			return stdout.trim();
		});

		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Version`)
			.addFields(
				{ name: "Git branch", value: gitBranch }
			)
		message.channel.send(embed);
	}
}