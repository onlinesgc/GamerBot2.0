const configModel = require("../models/configSchema");

module.exports = {
	name: "confget",
	aliases: [],
	description: "Get config options!",
	usage: [],
	perms: ["adminCmd"],
	async do(client, message, args, Discord) {
		
		//Retreive options
		configData = await configModel.findOne({ id: 0 });
		if (!configData) {
			let config = await configModel.create({
				prefix: ".",
				id: 0
			});
			config.save();
		}
		
		let configData2 = JSON.parse(JSON.stringify(configData));
		configData2.id = undefined;
		configData2._id = undefined;
		configData2.__v = undefined;

		const embed = new Discord.MessageEmbed()
			.setColor("#f54242")
			.setTitle(`Config`)
			.setDescription(`Konfigurationen för boten ser just nu ut såhär!`)
			.addFields(
				{ name: "Konfiguration:", value: `${JSON.stringify(configData2, null, 4)}` }
			)
		message.channel.send(embed);
	}
}