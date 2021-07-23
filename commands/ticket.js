const discord = require("discord.js");

module.exports = {
    name: "ticket",
    aliases: [],
	description: "Skappar en hjälp kanal",
    usage: ["Skriv .ticket i #ticket kanalen för att skapa en ticket!\n\nTickets är det bästa sättet att få moderatorernas uppmärksamhet för att få hjälp samt att anmäla dåligt beteende hos någon servermedlem. Det är också ett bra sätt att påpeka problem eller önskemål med servern!"],
    perms: [],
	async do(message, args, profileData) {
		await message.react("✅");

		const channel = await message.guild.channels.create(`ticket - ${message.author.tag}`);
		if (message.guild.id === "813844220694757447") {		//Test server
			channel.setParent("821139274589274143");
		} else if (message.guild.id === "516605157795037185") {	//Production server
			channel.setParent("822548929052409896");
		}

		channel.permissionOverwrites.edit(message.guild.id, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: false
		});
		channel.permissionOverwrites.edit(message.author, {
			SEND_MESSAGES: true,
			VIEW_CHANNEL: true
		});
		const row = new discord.MessageActionRow()
			.addComponents(
				[
					new discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("🔒")
						.setCustomId("lock"),
					new discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("🔓")
						.setCustomId("unlock"),
					new discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("⛔")
						.setCustomId("close"),
				]
			);
		const welcomeMessage = await channel.send({content:`Tack för att du öppnade en ticket! <@` + message.author.id + `> ! <@&812348382810210314> kommer svara inom kort!`,components:[row]});

		const collector = welcomeMessage.createMessageComponentCollector(data =>
			message.guild.members.cache.find((member) => member.id === data.user.id).permissions.has("ADMINISTRATOR"),
			{ dispose: true }
		);
		collector.on("collect", data => {
			if(message.guild.members.cache.find((member) => member.id === data.user.id).permissions.has("ADMINISTRATOR")){
				switch (data.customId) {
					case "lock":
						channel.permissionOverwrites.edit(message.author, {
							SEND_MESSAGES: false
						});
						channel.send("Den här kanalen har blivit låst!");
						break;
					case "unlock":
						channel.permissionOverwrites.edit(message.author, {
							SEND_MESSAGES: true
						});
						channel.send("Den här kanalen är nu upplåst igen!");
						break;
					case "close":
						channel.send("Tar bort kanalen om 5 sekunder...");
						setTimeout(() => channel.delete(), 5000);
						break;
				}
			}
			data.deferUpdate()
		})

		message.channel.send(`Vi har skapat en kanal för dig! ${channel}`).then((msg) => {
			setTimeout(() => message.delete(), 2500);
			setTimeout(() => msg.delete(), 5000);
		});
	}
}
