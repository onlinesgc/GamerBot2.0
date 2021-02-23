const profileModel = require("../../models/profileSchema");

module.exports = async(Discord, client, message) => {
	var prefix = ".";

	let profileData;
	try {
		profileData = await profileModel.findOne({ userID: message.author.id })
		if (!profileData) {
			let profile = await profileModel.create({
				userID: message.author.id,
				serverID: message.guild.id,
				xp: 0
			});
			profile.save();
		} else {
			profileData.xp += 1;
			profileData.save();
		}
	} catch (err) {
		console.log(err);
	}

	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command = client.commands.get(cmd);
	if (command) {
		command.do(client, message, args, Discord, profileData);
	}
}