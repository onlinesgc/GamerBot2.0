const { Client, Intents, Collection } = require("discord.js");
const functions = require("./functions");
const dotenv = require('dotenv');

const client = new Client(
{
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents:[
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES
    	]
    }
);

dotenv.config();
const token = process.env.token;

functions.initWebserver(client);	//Start a web server

client.commands = new Collection();
client.mention_commands = new Collection();
client.question_commands = new Collection();
client.channel_actions = new Collection();
client.reaction_actions = new Collection();

["command_handler", "event_handler", "mention_handler",
 "question_handler", "channel_handler", "reaction_handler"].forEach(handler => {
	require(`./handlers/${handler}.js`)(client);
});

client.login(token);
