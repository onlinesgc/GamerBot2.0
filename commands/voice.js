const Discord = require("discord.js");
const functions = require("../functions");
const profileModel = require("../models/profileSchema");
const guildConfig = require("../models/guildConfigSchema");
const {SlashCommandBuilder} = require("@discordjs/builders")

module.exports = {
	name: "voice",
	aliases: ["vc"],
	description: "Använd detta kommando för att hantera privata röstkanaler, bjuda in andra etc.",
	usage: [
		"voice invite <userID>",
		"voice kick <userID>"
	],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("voice")
		.setDescription("Använd detta kommando för att hantera privata röstkanaler, bjuda in andra etc.")
		.addUserOption((option) =>{
			return option.setName("invite").setDescription("Personen du vill bjuda in till samtalet").setRequired(false);
		})
		.addUserOption((option) =>{
			return option.setName("kick").setDescription("Person du vill kicka från samtalet").setRequired(false);
		})
		.addStringOption((option)=>{
			return option.setName("name").setDescription("Ändra namnet på kanalen till vad du vill").setRequired(false);
		})
		.addStringOption((option)=>{
			return option.setName("lock").setDescription("Lås kanalen").setRequired(false).addChoice("Lock channel","lock")
		})
		.addStringOption((option)=>{
			return option.setName("unlock").setDescription("Öppna kanalen").setRequired(false).addChoice("Unlock channel","unlock")
		})
		.addIntegerOption((option)=>{
			return option.setName("limit").setRequired(false).setDescription("Sätt gräns på hur många som kan joina")
		})
		.addUserOption((option) =>{
			return option.setName("give").setDescription("Ge kanalen till en annan användare i samtalet").setRequired(false);
		})
		.addStringOption((option) =>{
			return option.setName("inveterole").setDescription("Bjud in en hel rol").setRequired(false)
			.addChoice("Alla trusted", "AllTrusted")
			.addChoice("VIP", "vip")
			.addChoice("XPTrusted", "818809151257575464")
			.addChoice("Twitch Mods", "924078241344536607")
			.addChoice("Eventsnubbar","813804280741101678")
			.addChoice("Twitch Subs","817886647915642930")
			.addChoice("YouTube Members","835156231861698562")
			.addChoice("level 30", "872096892845166613")
		}),
	async do(message, args, profileData,isInteraction) {
		if (profileData.privateVoiceID !== message.member.voice.channelId) {
			if(!isInteraction) return message.channel.send("Du måste vara i en privat röstkanal som tillhör dig för att använda det här kommandot.")
			else return message.reply({content:"Du måste vara i en privat röstkanal som tillhör dig för att använda det här kommandot.",ephemeral:true})

		}
		let channel = message.guild.channels.cache.get(profileData.privateVoiceID);

		if (!args[0] && message.options._hoistedOptions[0] == undefined) {		//Show information about the user's private voice channel
			const embed = new Discord.MessageEmbed()
				.setColor("#0099ff")
				.setTitle(`${message.member.displayName}'s röstkanal`)
				.addFields(
					{ name: "Inbjudna", value: await getVoiceLobbyMembers(channel) }
				)
				.setTimestamp()
			
			if(!isInteraction) return message.channel.send({embeds:[embed]});
			else return message.reply({embeds:[embed]})
		}
		if(isInteraction){
			args[0] = message.options._hoistedOptions[0].name;
		}
		let member;
		let guildConfigData;
		switch (args[0]) {
			case "invite":
				guildConfigData = await guildConfig.fetchGuildConfig(message.guild.id);	
				if(!isInteraction){
					if (message.mentions.members.first()) {
						member = await message.mentions.members.first();
					} else {
						member = await message.guild.members.fetch(args[1]);
					}
				}
				else member = message.options._hoistedOptions[0].member;
				if(member != undefined){
					if(profileData.privateVoiceThreadID != "" ) await message.guild.channels.cache.get(guildConfigData.infoVoiceChannel).threads.cache.get(profileData.privateVoiceThreadID).members.add(member.id)
					channel.permissionOverwrites.edit(member, {
						"VIEW_CHANNEL": true,
						"SPEAK": true,
						"CONNECT": true
					});
					if(!isInteraction) return message.channel.send(`Jag bjöd in <@!${args[1]}> till samtalet.`);
					else message.reply(`Jag bjöd in <@!${member.id}> till samtalet.`)
				}
				else{
					if(!isInteraction) return message.channel.send(`Du förskte bjuda in någon som inte är på denna server!`);
					else message.reply({content:`Du förskte bjuda in någon som inte är på denna server!`,ephemeral:true})
				}
			break;
			case "kick":
				guildConfigData = await guildConfig.fetchGuildConfig(message.guild.id);	
				if(!isInteraction){
					if (message.mentions.members.first()) {
						member = await message.mentions.members.first();
					} else {
						member = await message.guild.members.fetch(args[1]);
					}
				}
				else member = message.options._hoistedOptions[0].member;
				if(member != undefined){
					if(profileData.privateVoiceThreadID != "" ) await message.guild.channels.cache.get(guildConfigData.infoVoiceChannel).threads.cache.get(profileData.privateVoiceThreadID).members.remove(member.id)
					channel.permissionOverwrites.edit(member, {
						"VIEW_CHANNEL": false,
						"SPEAK": false,
						"CONNECT": false
					});
					if(!isInteraction) return message.channel.send(`<@!${args[1]}> har inte längre tillgång till samtalet.`);
					else message.reply(`<@!${member.id}> har inte längre tillgång till samtalet.`)
				}
				else{
					if(!isInteraction) return message.channel.send(`Du förskte kicka någon som inte är i detta samtal`);
					else message.reply({content:`Du förskte kicka någon som inte är i detta samtal`,ephemeral:true})
				}
				break;
			case "name":																											//Change name of voice channel
				if(isInteraction){
					channel.setName(message.options._hoistedOptions[0].value);
					message.reply(`Ändrade namnet på kanalen till ${message.options._hoistedOptions[0].value}`)
				}
				else{
					channel.setName(args[1]);
					message.channel.send(`Ändra namnet till kanalen till ${args[1]}`)
				}
				break;
			case "lock":																											//Make voice channel private whilst retaining all members
				channel.permissionOverwrites.edit(message.guild.roles.everyone, {
					"VIEW_CHANNEL": false,
					"SPEAK": false,
					"CONNECT": false
				});
				if(!isInteraction) message.channel.send(`Vi har låst samtalet!`);
				else message.reply(`Vi har låst samtalet!`)
				break;
			case "unlock":																											//Make voice channel public
				channel.permissionOverwrites.edit(message.guild.roles.everyone, {
					"VIEW_CHANNEL": true,
					"SPEAK": true,
					"CONNECT": true
				});
				if(!isInteraction) message.channel.send(`Vi har öppnat samtalet!`);
				else message.reply(`Vi har öppnat samtalet!`)
				break;
			case "limit":																											//Set user limit
				let userLimit;

				if(isInteraction) args[1] = message.options._hoistedOptions[0].value;

				if (!args[1]) {
					userLimit = 0;
					if(!isInteraction) message.channel.send(`Du skrev inte in ett nummer, så stänger av limiten`);
					else message.reply(`Du skrev inte in ett nummer, så stänger av limiten`)
				} else {
					if(!isNaN(args[1])){
						if(args[1] >= 51 || args[1] <= -1){
							userLimit = 50;
							if(!isInteraction) message.channel.send(`Du får inte ha ett nummer som är störe en 50`);
							else message.reply(`Du får inte ha ett nummer som är större än 50`)
						}
						else{
							userLimit = Math.round(args[1]);
							if(!isInteraction) message.channel.send("Du ändra limit av kanalen!");
							else message.reply("Du ändra limit av kanalen!")
						}
					}
					else {
						userLimit = 0;
						if(!isInteraction) message.channel.send(`Du skrev inte in ett numer`);
						else message.reply(`Du skrev inte in ett numer`)
					}
					
				}
				channel.setUserLimit(userLimit);
				break;
			case "give":
				if(!isInteraction){
					if (message.mentions.members.first()) {
						member = await message.mentions.members.first();
					} else {
						member = await message.guild.members.fetch(args[1]);
					}
				}
				else member = message.options._hoistedOptions[0].member;
				if(member != undefined){
					if(channel.members.has(member.id)){
						profileData.privateVoiceID = "";
						await profileData.save();
						let giveMember = await profileModel.fetchProfile(member.id, member.guild.id)
						giveMember.privateVoiceID = channel.id;
						giveMember.save();
						if(!isInteraction) message.channel.send(`Du har nu get kanalen till <@!${member.id}>`);
						else message.reply(`Du har nu get kanalen till <@!${member.id}>`)
					}
					else{
						console.log("yes")
						if(!isInteraction) message.channel.send(`Du förskte ge samtalet till någon som inte är i kanlen!`);
						else message.reply(`Du förskte ge samtalet till någon som inte är i kanlen!`)
					}
				}
				else {
					if(!isInteraction) message.channel.send(`Du förskte ge samtalet till någon som inte är i kanlen!`);
					else message.reply(`Du förskte ge samtalet till någon som inte är i kanlen!`)
				}
			break;
			case "inveterole":
				if(!isInteraction) return message.channel.send("Detta command kan bara bli aktiverat med / commands");
				var MultipleRoles = [
					{
						value:"AllTrusted",
						roles:["813804280741101678","924078241344536607","520331216415621143","818809151257575464","821059798270214176","812324460429836318","813482380887064597","872157696709783552"]
					},
					{
						value:"VIP",
						roles:["813804280741101678","924078241344536607","520331216415621143","818809151257575464","821059798270214176","812324460429836318","813482380887064597","817886647915642930","835156231861698562"]
					}
				]
				if(/\d/.test(message.options._hoistedOptions[0].value)){ //if it has number
					let role = await channel.guild.roles.cache.get(message.options._hoistedOptions[0].value);
					channel.permissionOverwrites.edit(role, {
						"VIEW_CHANNEL": true,
						"SPEAK": true,
						"CONNECT": true
					});
					message.reply("I have inveted " + role.name + " role to the voice chat");
				}
				else{
					MultipleRoles.forEach(element =>{
						if(element.value == message.options._hoistedOptions[0].value){
							element.roles.forEach(async element2 =>{
								let role = await channel.guild.roles.cache.get(element2);
								await channel.permissionOverwrites.edit(role, {
									"VIEW_CHANNEL": true,
									"SPEAK": true,
									"CONNECT": true
								});
							})
						}
					})
					message.reply("Bjöd in alla dem rolerna\n(Om du vill att någon ska kunna se denna threed så måste du bjuda in den personen manuelt!)");
				}

			break;
		}
		async function getVoiceLobbyMembers(channel){
			let members = [];
			await channel.permissionOverwrites.cache.map(type => {
				if(type.type == "member"){
					if(type.allow.has("VIEW_CHANNEL")){
						members.push(type)
					}
				};
			})
			let ids = await members.map(id => id.id);
			let message = "";
			await ids.forEach(elemet =>{
				message += `<@!${elemet}>\n`
			})
			return message;
		}
	}
}