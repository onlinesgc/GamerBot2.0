module.exports = {
	name: "whoareyou",
	permittedMessages: ["vem är du"],
	description: "Prints information about this bot!",
	perms: [],
	async do(client, message, args, Discord) {
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Om mig`)
			.setDescription(`Jag är en bot skapad för Stamsites Discord av bot-teamet!`)
			.setThumbnail(client.user.avatarURL())
			.addFields(
				{ name: "Repo", value: "Om du vill hjälpa till att utveckla mig finns källkoden tillgänglig [här](https://github.com/stamdiscord/GamerBot2.0)!"}
			)
		message.channel.send(embed);
	}
}