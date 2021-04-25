const Discord = require('discord.js');

module.exports = {
	name: "reminders",
	aliases: ["myreminders"],
	description: "Visa dina påminnelser!",
	usage: ["reminders"],
	perms: [],
	async do(message, args, profileData) {
		const indexes = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

		let fields = [];
		profileData.reminders.forEach((element, i) => {
			const remindTime = new Date(element.remindTimestamp);
			fields.push({ name: i, value: `
				Datum och tid: \`${remindTime}\`
				Meddelande: \`${element.message}\`
			` });
		});

		//Send the first message
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle(`Påminnelser`)
			.addFields(
				fields
			)
			.setTimestamp()
		let msg = await message.channel.send(embed);
		for (let index = 0; index < profileData.reminders.length; index++) {
			await msg.react(indexes[index]);
		}

		//Create a collector for page selecting
		const filter = (reaction, user) => {
			return true;
		};
		const collector = msg.createReactionCollector(filter);

		//Collector reaction event
		collector.on("collect", async (reaction, user) => {
			reaction.users.remove(user.id);					//Remove user reaction
			if (user.id !== message.author.id) return;		//Filter out unauthorized users
			
			let index = indexes.indexOf(reaction.emoji.name);
			if (index === -1) return message.channel.send("Invalid emoji");
			
			reaction.users.remove(message.client.user.id);	//Remove bot reaction
		});
	}
}