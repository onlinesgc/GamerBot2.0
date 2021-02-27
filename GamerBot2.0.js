const Discord = require("discord.js");
const mongoose = require("mongoose");
require('dotenv').config();

const client = new Discord.Client();

const token = process.env.token;

client.commands = new Discord.Collection();
client.mention_commands = new Discord.Collection();

["command_handler", "event_handler", "mention_handler"].forEach(handler => {
	require(`./handlers/${handler}.js`)(client, Discord);
});

mongoose.connect(process.env.mongodb_srv, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log("Connected to the database!");
}).catch((err) => {
	console.log(process.env.mongodb_srv);
	console.log(err);
})

client.login(token);