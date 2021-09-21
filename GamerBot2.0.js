const Discord = require("discord.js");
const functions = require("./functions");
require('dotenv').config();

const client = new Discord.Client(
	{
		partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
		intents: [
			Discord.Intents.FLAGS.GUILDS,
			Discord.Intents.FLAGS.GUILD_MEMBERS,
			Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
			Discord.Intents.FLAGS.DIRECT_MESSAGES,
			Discord.Intents.FLAGS.GUILD_MESSAGES,
			Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Discord.Intents.FLAGS.GUILD_PRESENCES,
		]
	}
);
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

client.login(token);