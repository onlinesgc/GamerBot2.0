module.exports = {
    name: "ticket",
    aliases: [],
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

		const welcomeMessage = await channel.send(`Tack för att du öppnade en ticket! <@` + message.author.id + `> ! <@&812348382810210314> kommer svara inom kort!`);
		await welcomeMessage.react("🔒");
		await welcomeMessage.react("🔓");
		await welcomeMessage.react("⛔");

		const collector = welcomeMessage.createReactionCollector((reaction, user) =>
			message.guild.members.cache.find((member) => member.id === user.id).hasPermission("ADMINISTRATOR"),
			{ dispose: true }
		);
		collector.on("collect", (reaction, user) => {
			switch (reaction.emoji.name) {
				case "🔒":
					channel.permissionOverwrites.edit(message.author, {
						SEND_MESSAGES: false
					});
					channel.send("Den här kanalen har blivit låst!");
					break;
				case "🔓":
					channel.permissionOverwrites.edit(message.author, {
						SEND_MESSAGES: true
					});
					channel.send("Den här kanalen är nu upplåst igen!");
					break;
				case "⛔":
					channel.send("Tar bort kanalen om 5 sekunder...");
					setTimeout(() => channel.delete(), 5000);
					break;
			}
		})

		message.channel.send(`Vi har skapat en kanal för dig! ${channel}`).then((msg) => {
			setTimeout(() => message.delete(), 2500);
			setTimeout(() => msg.delete(), 5000);
		});
	}
}
