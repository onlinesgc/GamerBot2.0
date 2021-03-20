const Discord = require('discord.js');

module.exports = {
	name: "play",
	aliases: [],
	description: "Play minigames!",
	usage: [],
	perms: [],
	async do(message, args) {
		function updateScreen(array) {
			let arrayString = "";
			array.forEach(element => {
				element.forEach(element2 => {
					arrayString += element2
				});
				arrayString += "\n";
			});
			return arrayString;
		}

		const array = [
			["🟧", "🟧", "🟧", "🟧", "🟧"],
			["🟧", "🟧", "🟧", "🟧", "🟧"],
			["🟧", "🟧", "🟧", "🟧", "🟧"],
			["🟧", "🟧", "🟧", "🟧", "🟧"],
			["🟧", "🟧", "🟧", "🟧", "🟧"]
		];
		let playerX = 2;
		let playerY = 1;
		array[playerY][playerX] = "🟫";
		
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Minigame`)
			.setDescription(`${updateScreen(array)}`)
		let msg = await message.channel.send(embed);
		await msg.react("⬅️");
		await msg.react("⬆️");
		await msg.react("⬇️");
		await msg.react("➡️");

		const filter = (reaction, user) => {
			return true;
		};
		const collector = msg.createReactionCollector(filter);

		collector.on("collect", (reaction, user) => {
			reaction.users.remove(message.author.id);		//Remove reaction
			array[playerY][playerX] = "🟧";
			switch (reaction.emoji.name) {
				case "⬅️":
					playerX -= 1;
					break;
				case "⬆️":
					playerY -= 1;
					break;
				case "⬇️":
					playerY += 1;
					break;
				case "➡️":
					playerX += 1;
					break;
			}
			array[playerY][playerX] = "🟫";
			const embed = new Discord.MessageEmbed()
				.setColor("#f54242")
				.setTitle(`Minigame`)
				.setDescription(`${updateScreen(array)}`)
			msg.edit(embed);
		});
	}
}