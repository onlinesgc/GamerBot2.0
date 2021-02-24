const Discord = require("discord.js");
const mongoose = require("mongoose");
const { prefix } = require("./config.json");
require("dotenv").config();

const client = new Discord.Client();

const token = process.env.token;

client.commands = new Discord.Collection();

["command_handler", "event_handler"].forEach((handler) => {
  require(`./${handler}.js`)(client);
});

client.on("message", (message) => {
  if (message.author.bot) return;

  if (message.channel.id == "809393742637170708") {
    message.react("✅");
    message.react("❌");
  } else if (
    message.content.toLowerCase().replace(/\s/g, "").includes("gaming")
  ) {
    if (
      message.channel.id == "809483972282810390" ||
      message.channel.id == "780765093343395880"
    ) {
      if (Math.floor(Math.random() * 100) > 86) {
        message.channel.send("**GAMING! 🎮**");
      }
    }
  } else if (
    message.content.toLowerCase().includes("christerpog") ||
    message.content.toLowerCase().includes("cristerpog")
  ) {
    if (
      message.channel.id == "809483972282810390" ||
      message.channel.id == "780765093343395880"
    ) {
      message.react("810255466952917052");
      message.channel.send("<:mello_ChristerPOG:810255466952917052>");
    }
  } else if (message.mentions.has(client.user)) {
    message.channel.send("Hej, jag är en bot som gamear på min fritid!");
  } else if (message.content.toLowerCase().includes("hur mycket är klockan")) {
    var currentdate = new Date();
    var datetime =
      ("0" + currentdate.getHours()).slice(-2) +
      ":" +
      ("0" + currentdate.getMinutes()).slice(-2) +
      ":" +
      ("0" + currentdate.getSeconds()).slice(-2);
    message.channel.send(`Klockan är ${datetime}`);
  } else if (message.content.toLowerCase().includes("vad är klockan")) {
    var currentdate = new Date();
    var datetime =
      ("0" + currentdate.getHours()).slice(-2) +
      ":" +
      ("0" + currentdate.getMinutes()).slice(-2) +
      ":" +
      ("0" + currentdate.getSeconds()).slice(-2);
    message.channel.send(`Klockan är ${datetime}`);
  }
});

mongoose
  .connect(process.env.mongodb_srv, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log(process.env.mongodb_srv);
    console.log(err);
  });

client.login(token);
