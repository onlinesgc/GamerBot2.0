const discord = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
    name: "ticket",
    aliases: [],
	description: "Skappar en hjälp kanal",
    usage: ["Skriv .ticket i #ticket kanalen för att skapa en ticket!\n\nTickets är det bästa sättet att få moderatorernas uppmärksamhet för att få hjälp samt att anmäla dåligt beteende hos någon servermedlem. Det är också ett bra sätt att påpeka problem eller önskemål med servern!"],
    perms: [],
	data: new SlashCommandBuilder()
		.setName("ticket")
		.setDescription("Skappar en hjälp kanal")
		.addUserOption((option)=>{
			return option.setName("user").setDescription("Admin option").setRequired(false)
		}),
	async do(message, args, profileData,isInteraction) {
		if(isInteraction){
			if(message.options._hoistedOptions[0] != undefined) args[0] = message.options._hoistedOptions[0].user.id; 
		}
		if(await !message.member.permissions.has("ADMINISTRATOR")){
			args[0] = undefined;
		}
		if(!isInteraction) await message.react("✅");
		let channel;
		if(args[0] != undefined) channel = await message.guild.channels.create(`ticket - ${message.guild.members.cache.get(args[0]).user.username}`);
		else {
			if(!isInteraction) channel = await message.guild.channels.create(`ticket - ${message.author.tag}`);
			else channel = await message.guild.channels.create(`ticket - ${message.user.username}`);
		}
		if (message.guild.id === "813844220694757447") {		//Test server
			channel.setParent("821139274589274143");
		} else if (message.guild.id === "516605157795037185") {	//Production server
			channel.setParent("822548929052409896");
		}
		
		channel.permissionOverwrites.edit(message.guild.id, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: false,
			ATTACH_FILES:true
		});
		if(!isInteraction){
			channel.permissionOverwrites.edit(message.author, {
				SEND_MESSAGES: true,
				VIEW_CHANNEL: true,
				ATTACH_FILES:true
			});
		}
		else{
			channel.permissionOverwrites.edit(message.member, {
				SEND_MESSAGES: true,
				VIEW_CHANNEL: true,
				ATTACH_FILES:true
			});
		}
		if(args[0] != undefined){
			channel.permissionOverwrites.edit(args[0], {
				SEND_MESSAGES: true,
				VIEW_CHANNEL: true,
				ATTACH_FILES:true
			});
		}
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
		let welcomeMessage
		if(args[0] != undefined) welcomeMessage = await channel.send({content:`Vi har öppnat en ticket för dig! <@` + args[0] + `> ! <@&812348382810210314> kommer svara inom kort varför!`,components:[row]});
		else{
			if(!isInteraction) welcomeMessage = await channel.send({content:`Tack för att du öppnade en ticket! <@` + message.author.id + `> ! <@&812348382810210314> kommer svara inom kort!`,components:[row]});
			else welcomeMessage = await channel.send({content:`Tack för att du öppnade en ticket! <@` + message.user.id + `> ! <@&812348382810210314> kommer svara inom kort!`,components:[row]});
		} 
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

		if(!isInteraction){
			message.channel.send(`Vi har skapat en kanal för dig! ${channel}`).then((msg) => {
				setTimeout(() => message.delete(), 2500);
				setTimeout(() => msg.delete(), 5000);
			});	
		} 
		else message.reply({content:`Vi har skapat en kanal för dig! ${channel}`, ephemeral: true})
	}
}
