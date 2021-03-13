const Discord = require("discord.js");
const mongoose = require("mongoose");
const functions = require("./functions");
const configModel = require("./models/configSchema");
require('dotenv').config();

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const token = process.env.token;

functions.initWebserver(client)		//Start a web server

client.commands = new Discord.Collection();
client.mention_commands = new Discord.Collection();
client.question_commands = new Discord.Collection();
client.channel_actions = new Discord.Collection();
client.reaction_actions = new Discord.Collection();

["command_handler", "event_handler", "mention_handler", "question_handler", "channel_handler", "reaction_handler"].forEach(handler => {
	require(`./handlers/${handler}.js`)(client);
});

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.mongodb_srv, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(async() => {
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

client.login(token);