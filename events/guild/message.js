const profileModel = require("../../models/profileSchema");
const functions = require("../../functions")

module.exports = async(Discord, client, message) => {
	if (message.author.bot) return;
	
	var prefix = ".";

	let profileData;
	try {
		profileData = await profileModel.findOne({ userID: message.author.id })
		if (!profileData) {
			let profile = await profileModel.create({
				userID: message.author.id,
				serverID: message.guild.id,
				xp: 0,
				lastMessageTimestamp: message.createdTimestamp,
				xpTimeoutUntil: message.createdTimestamp + 300000
			});
			profile.save();
		} else {
			profileData.xp += 1;
			profileData.lastMessageTimestamp = message.createdTimestamp;
			profileData.xpTimeoutUntil = message.createdTimestamp + 300000;
			profileData.save();
		}
	} catch (err) {
		console.log(err);
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
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
	}


	if (message.channel.id == "809393742637170708") {
		message.react("✅");
		message.react("❌");
	}

	if (message.content.toLowerCase().replace(/\s/g, "").includes("gaming")) {
		if (message.channel.id == "809483972282810390" || message.channel.id == "780765093343395880") {
			if (Math.floor(Math.random() * 100) > 86) {
				message.channel.send("**GAMING! 🎮**");
			}
		}
	}
	if (message.content.toLowerCase().includes("christerpog") || message.content.toLowerCase().includes("cristerpog")) {
		if (message.channel.id == "809483972282810390" || message.channel.id == "780765093343395880") {
			message.react("810255466952917052")
			message.channel.send("<:mello_ChristerPOG:810255466952917052>")
		}
	}
	if (message.content.toLowerCase().includes("hur mycket är klockan") || message.content.toLowerCase().includes("vad är klockan")) {
		if (Math.floor(Math.random() * 100) > 91) {
			message.channel.send("**KLOCKAN TOLV!**")
		} else {
			var currentdate = new Date();
			var datetime =
				("0" + currentdate.getHours()).slice(-2) + ":" 
				+ ("0" + currentdate.getMinutes()).slice(-2) + ":" 
				+ ("0" + currentdate.getSeconds()).slice(-2)
			;
			message.channel.send(`Klockan är ${datetime}`);
		}
	}
}