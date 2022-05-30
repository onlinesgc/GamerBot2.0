const discord = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders")
const profileModel = require("../models/profileSchema");

module.exports = {
    name: "ticket",
    aliases: [],
	description: "Skapar en hjälp kanal",
    usage: ["Skriv .ticket i #hjälp-kanalen för att skapa en ticket!\n\nTickets är det bästa sättet att få moderatorernas uppmärksamhet för att få hjälp samt att anmäla dåligt beteende hos någon servermedlem. Det är också ett bra sätt att påpeka problem eller önskemål med servern!"],
    perms: [],
	data: new SlashCommandBuilder()
		.setName("ticket")
		.setDescription("Skapar en hjälpkanal")
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
						.setEmoji("⛔")
				]
		);
		let welcomeMessage
		if(args[0] != undefined) {
			row.components[0].setCustomId(`close_ticket:${channel.id}:${args[0]}:false`);
			welcomeMessage = await channel.send({content:`Vi har öppnat en ticket för dig! <@` + args[0] + `> ! <@&812348382810210314> kommer svara inom kort varför!\nDu kan lämna ticket:en om du trycker på ⛔`,components:[row], fetchReply: true});
		}
		else{
			if(!isInteraction) {
				row.components[0].setCustomId(`close_ticket:${channel.id}:${message.author.id}:false`);
				welcomeMessage = await channel.send({content:`Tack för att du öppnade en ticket! <@` + message.author.id + `> ! <@&812348382810210314> kommer svara inom kort!\nDu kan lämna ticket:en om du trycker på ⛔`,components:[row],fetchReply: true});
			}
			else {
				row.components[0].setCustomId(`close_ticket:${channel.id}:${message.user.id}:false`);
				welcomeMessage = await channel.send({content:`Tack för att du öppnade en ticket! <@` + message.user.id + `> ! <@&812348382810210314> kommer svara inom kort!\nDu kan lämna ticket:en om du trycker på ⛔`,components:[row],fetchReply: true});	
			} 
		} 
		if(!isInteraction){
			message.channel.send(`Vi har skapat en kanal för dig! ${channel}`).then((msg) => {
				setTimeout(() => message.delete(), 2500);
				setTimeout(() => msg.delete(), 5000);
			});	
		} 
		else message.editReply({content:`Vi har skapat en kanal för dig! ${channel}`, ephemeral: true})
	},
	async removeTicket(Interaction , channel, user, hasTicketCreatorLeft){
		let profileData = await profileModel.fetchProfile(user.id, channel.guild.id);
		hasTicketCreatorLeft = (profileData.hasLeftTicket != undefined ) ? profileData.hasLeftTicket : false;
		if((user.permissions.has("ADMINISTRATOR") && user.id != Interaction.member.id ) || hasTicketCreatorLeft == true){
				profileData.hasLeftTicket = false;
				profileData.save();
				channel.send("Tar bort kanalen om 5 sekunder...");
				setTimeout(() => channel.delete(), 5000);
		}
		else{
			channel.permissionOverwrites.edit(user, {
				SEND_MESSAGES: false,
				VIEW_CHANNEL: false,
				ATTACH_FILES: false
			});
			channel.send(`Nu har <@${user.id}> lämmnat!\nFör att ta bort ticket så kan man trycka på ⛔`)
			profileData.hasLeftTicket = true;
			profileData.save();
		}
		Interaction.deferUpdate()
	},
	async openTicket(Interaction){
		let channel = await Interaction.guild.channels.create(`ticket - ${Interaction.member.user.username}`);

		if (Interaction.guild.id === "813844220694757447") {		//Test server
			channel.setParent("821139274589274143");
		} else if (Interaction.guild.id === "516605157795037185") {	//Production server
			channel.setParent("822548929052409896");
		}
		
		channel.permissionOverwrites.edit(Interaction.guild.id, {
			SEND_MESSAGES: false,
			VIEW_CHANNEL: false,
			ATTACH_FILES:true
		});
		channel.permissionOverwrites.edit(Interaction.member, {
			SEND_MESSAGES: true,
			VIEW_CHANNEL: true,
			ATTACH_FILES:true
		});
		const row = new discord.MessageActionRow()
			.addComponents(
				[
					new discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("⛔")
				]
		);
		row.components[0].setCustomId(`close_ticket:${channel.id}:${Interaction.user.id}:false`);
		await channel.send({content:`Tack för att du öppnade en ticket! <@` + Interaction.user.id + `> ! <@&812348382810210314> kommer svara inom kort!\nDu kan lämna ticket:en om du trycker på ⛔`,components:[row],fetchReply: true});
		Interaction.deferUpdate();	 
	}
}
