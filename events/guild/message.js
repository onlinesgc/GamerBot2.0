const functions = require("../../functions");
const profileModel = require("../../models/profileSchema");

module.exports = async(Discord, client, message) => {
	if (message.author.bot) return;
	
	var prefix = ".";

	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
	const mention_command = client.mention_commands.find(object => message.content && object.permittedMessages.some(element => message.content.toLowerCase().includes(element)));
	const question_command = client.question_commands.find(object => message.content && object.permittedMessages.some(element => message.content.toLowerCase().replace(/\s/g, "").includes(element)));
	
	let profileData = await profileModel.findOne({ userID: message.author.id })
	if (!profileData) {
		let profile = await profileModel.create({
			userID: message.author.id,
			serverID: message.guild.id,
			xp: 0,
			lastMessageTimestamp: message.createdTimestamp,
			xpTimeoutUntil: message.createdTimestamp + 300000
		});
		profile.save();
	}

	if (command) {
		if (command.perms.includes("adminCmd")) {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				command.do(client, message, args, Discord, profileData);
			} else {
				message.channel.send("Du har inte tillåtelse att exekvera det här kommandot!");
			}
		} else {
			command.do(client, message, args, Discord, profileData);
		}
	} else if (mention_command && functions.checkIfMentioned(message)) {
		if (mention_command.perms.includes("adminCmd")) {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				mention_command.do(client, message, args, Discord, profileData);
			} else {
				message.channel.send("Du har inte tillåtelse att exekvera det här kommandot!");
			}
		} else {
			mention_command.do(client, message, args, Discord, profileData);
		}
	} else if (question_command) {
		if (question_command.perms.includes("adminCmd")) {
			if (message.member.hasPermission("ADMINISTRATOR")) {
				question_command.do(client, message, args, Discord, profileData);
			} else {
				message.channel.send("Du har inte tillåtelse att exekvera det här kommandot!");
			}
		} else {
			question_command.do(client, message, args, Discord, profileData);
		}
	} else {
		profileData.lastMessageTimestamp = message.createdTimestamp;
		if (profileData.xpTimeoutUntil - message.createdTimestamp < 0) {
			profileData.xp += 1;
			profileData.xpTimeoutUntil = message.createdTimestamp + 300000;
		}
		profileData.save();
	}

	if (message.channel.id == "809393742637170708") {
		message.react("✅");
		message.react("❌");
	}
	
	if (message.content.toLowerCase().includes("christerpog") || message.content.toLowerCase().includes("cristerpog")) {
		if (message.channel.id == "809483972282810390" || message.channel.id == "780765093343395880") {
			message.react("810255466952917052")
			message.channel.send("<:mello_ChristerPOG:810255466952917052>")
		}
	}
}