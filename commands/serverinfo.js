const Discord = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	name: "serverinfo",
	aliases: [],
	description: "Print server information!",
	usage: [],
	perms: [],
	data: new SlashCommandBuilder()
	.setName("serverinfo")
	.setDescription("Print server information!"),
	async do(message, args, profileData, isInteraction) {
		const embed = new Discord.MessageEmbed()
			.setColor("#0099ff")
			.setTitle(`Serverinfo`)
			.setThumbnail(message.guild.iconURL())
			.addFields(
			    { name: "Medlemmar", value: `\`${message.guild.memberCount}\`` },
				{ name: "Status", value: `
					🟢 \`${message.guild.members.cache.filter(m => m.presence && m.presence.status == "online").size}\` medlemmar är online!
					🟡 \`${message.guild.members.cache.filter(m => m.presence && m.presence.status === "idle").size}\` personer är idle.
					🔴 \`${message.guild.members.cache.filter(m => m.presence && m.presence.status === "dnd").size}\` personer är stör ej.
					⚫ \`${message.guild.members.cache.filter(m => m.presence == null || m.presence.status === "offline").size}\` personer är offline.

					🟣 \`${message.guild.members.cache.filter(m => m.premiumSince).size}\` Personer som bostar servern
					🕓 \`${message.guild.members.cache.filter(m => m.presence && m.presence.status === "online" && m.permissions.has("ADMINISTRATOR") && !m.user.bot).size}\` admins är tillgängliga!`

				},
				{
					name:"Boost nivå", value: `\`${message.guild.premiumTier}\``
				}
			)
		if(!isInteraction) message.channel.send({embeds:[embed]});
		else message.reply({embeds:[embed]})
	}
}
