const profileModel = require("../models/profileSchema");
const functions = require("../functions")

module.exports = {
	name: "memberinfo",
	aliases: [],
	description: "Get member information for specified user!",
	usage: [],
	perms: [],
	async do(client, message, args, Discord) {
		let member;
		let user;
		if (!args[0]) {
			return message.channel.send("Du måste ange vilken användare du vill veta mer information om!")
		} else {
			if (message.mentions.members.first()) {
				member = message.mentions.members.first();
				user = message.mentions.users.first();
			} else {
				member = await message.guild.members.fetch(args[0]);
				user = await client.users.fetch(args[0]);
			}
		}

		let profile_data = await profileModel.fetchProfile(member.id, message.guild.id);		//Fetch profile

		let fields = [
			{ name: "XP", value: profile_data.xp, inline: true }
		];
		if (profile_data.xpTimeoutUntil - message.createdTimestamp > 0) {
			fields.push({ name: "XP Timeout", value: functions.msToString(profile_data.xpTimeoutUntil - message.createdTimestamp), inline: true });
		}

		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Information om medlem`)
			.setDescription(`${member}'s information.`)
			.setImage(user.avatarURL())
			.addFields(
				fields,
				{ name: "id", value: profile_data.userID }
			)
		message.channel.send(embed);
	}
}