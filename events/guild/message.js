const functions = require("../../functions");
const profileModel = require("../../models/profileSchema");
const configModel = require("../../models/configSchema");
const Discord = require('discord.js');

module.exports = async (message, client) => {
	if (message.author.bot) return;

	//Retreive options
	let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options

	const prefix = configData.prefix;
	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	if (configData.debug && (client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd)))) {
		try {
			delete require.cache[require.resolve(`../../commands/${cmd}.js`)];
			client.commands.delete(cmd);
			const pull = require(`../../commands/${cmd}.js`);
			client.commands.set(cmd, pull);
		} catch (err) {
			console.log(err);
		}
	}

	const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
	const mention_command = client.mention_commands.find(object => message.content && object.permittedMessages.some(element => message.content.toLowerCase().includes(element)));
	const question_command = client.question_commands.find(object => message.content && object.permittedMessages.some(element => message.content.toLowerCase().replace(/\s/g, "").includes(element)));
	const channel_action = client.channel_actions.find(object => object.channels.includes(message.channel.id));
	
	let profileData = await profileModel.fetchProfileFromMessage(message);		//Fetch profile

	if (command && message.content.startsWith(prefix)) {
		if (command.perms.includes("adminCmd")) {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				try {
					await command.do(message, args, profileData);
				} catch (err) {
					message.channel.send("Det har inträffat ett fel med det här kommandot. Se konsolen för mer information!")
				}
			} else {
				message.channel.send("Du har inte tillåtelse att exekvera det här kommandot!");
			}
		} else {
			try {
				await command.do(message, args, profileData);
			} catch (err) {
				message.channel.send("Det har inträffat ett fel med det här kommandot. Se konsolen för mer information!")
			}
		}
	} else if (mention_command && functions.checkIfMentioned(message)) {
		if (mention_command.perms.includes("adminCmd")) {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				mention_command.do(message, args, profileData);
			} else {
				message.channel.send("Du har inte tillåtelse att exekvera det här kommandot!");
			}
		} else {
			mention_command.do(message, args, profileData);
		}
	} else if (question_command) {
		if (question_command.perms.includes("adminCmd")) {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				question_command.do(message, args, profileData);
			} else {
				message.channel.send("Du har inte tillåtelse att exekvera det här kommandot!");
			}
		} else {
			question_command.do(message, args, profileData);
		}
	} else {
		profileData.lastMessageTimestamp = message.createdTimestamp;
		if ((profileData.xpTimeoutUntil - message.createdTimestamp < 0) || (!configData.xp.timeoutsEnabled)) {
			const xpAmount = Math.floor(Math.random() * 3) + 1;
			profileData.xp += xpAmount;
			profileData.xpTimeoutUntil = message.createdTimestamp + 300000 * xpAmount + functions.getRandomIntRange(-100000, 100000);
			let levelTotal = x*math.log(xp); //allow chance of x variable in config for tweaking
			
			if (profileData.level < parseInt(levelTotal) {
			    
			}
			if (profileData.xp > profileData.level * 10) {
				profileData.level++;
			}
		}
		profileData.save();
	}

	if (channel_action) {
		channel_action.do(message, profileData);
	}
	
	if (message.content.toLowerCase().includes("christerpog") || message.content.toLowerCase().includes("cristerpog")) {
		if (message.channel.id == "809483972282810390" || message.channel.id == "780765093343395880") {
			message.react("810255466952917052")
			message.channel.send("<:mello_ChristerPOG:810255466952917052>")
		}
	}
}
