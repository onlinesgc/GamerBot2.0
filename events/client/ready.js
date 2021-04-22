const mongoose = require("mongoose");
const configModel = require("../../models/configSchema");
const functions = require("../../functions");

module.exports = (client) => {
	console.log(`${client.user.username} is online! Hosting ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

	mongoose.set('useCreateIndex', true);
	mongoose.connect(process.env.mongodb_srv, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}).then(async () => {
		console.log("Connected to the database!");

		//Retreive options
		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options
		console.log("Options retrieved!");

		//Apply options
		functions.applyOptions(client, configData);
		console.log("Options applied!");
	}).catch((err) => {
		console.log(process.env.mongodb_srv);
		console.log(err);
	})
}