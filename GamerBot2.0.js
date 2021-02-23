const Discord = require("discord.js");
const client = new Discord.Client();

const messageHandler = require("./src/message_handler");

require('dotenv').config();
var token = process.env.token;

function doNothing() {

}

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  messageHandler.handle(client, message);
});

client.login(token);