module.exports = {
	name: "me",
	description: "Print information about user!",
    perms: [],
	async do(client, message, args, Discord, profileData) {
		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`User info`)
			.setDescription(`${message.member}'s user information.`)
            .addFields(
				{ name: "XP", value: profileData.xp }
			)
		message.channel.send(embed);
	}
}