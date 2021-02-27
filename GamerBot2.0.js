const Discord = require("discord.js");
const mongoose = require("mongoose");
const configModel = require("./models/configSchema");
require('dotenv').config();

const client = new Discord.Client();

const token = process.env.token;

client.commands = new Discord.Collection();
client.mention_commands = new Discord.Collection();
client.question_commands = new Discord.Collection();
client.channel_actions = new Discord.Collection();

["command_handler", "event_handler", "mention_handler", "question_handler", "channel_handler"].forEach(handler => {
	require(`./handlers/${handler}.js`)(client, Discord);
});

mongoose.connect(process.env.mongodb_srv, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(async() => {
	console.log("Connected to the database!");

	//Retreive options
	let configData = await configModel.fetchConfig(0);		//Retreive options
	console.log("Options retrieved!");
}).catch((err) => {
	console.log(process.env.mongodb_srv);
	console.log(err);
})

client.login(token);