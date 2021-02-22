const Discord = require("discord.js");
const mongoose = require("mongoose");
require('dotenv').config();

const client = new Discord.Client();

const token = process.env.token;

client.commands = new Discord.Collection();

["command_handler", "event_handler"].forEach(handler => {
	require(`./${handler}.js`)(client, Discord);
});

client.on("message", (message) => {
	if (message.author.bot) {
		return;
	}
	if (message.channel.id == "809393742637170708") {
		message.react("✅");
		message.react("❌");
	}
	else if (message.content.toLowerCase().replace(/\s/g, "").includes("gaming")) {
		if (message.channel.id == "809483972282810390" || message.channel.id == "780765093343395880") {
			if (Math.floor(Math.random() * 100) > 86) {
					message.channel.send("**GAMING! 🎮**");
			}/* else {
				const random = Math.floor(Math.random() * 100);
				if (random > 79) message.channel.send("Ingen gaming här inte. Prova **INTE** en gång till!");
				else if (random > 69) message.channel.send("Jag är ledsen att säga det, men du är inte en riktig gamer!");
				else if (random > 59) message.channel.send("Ingen gaming här inte!");
				else if (random > 39) message.channel.send("Nej tyvärr, Ingen gaming den här gången.");
				else if (random > 19) message.channel.send("Gå och lägg dig istället.");
				else message.channel.send("Nej du, ingen gaming!");
			}*/
		}
	}
	else if (message.content.toLowerCase().includes("christerpog") || message.content.toLowerCase().includes("cristerpog")) {
		if (message.channel.id == "809483972282810390" || message.channel.id == "780765093343395880") {
			message.react("810255466952917052")
			message.channel.send("<:ChristerPOG:810255466952917052>")
		}
	}
	else if (message.mentions.has(client.user)) {
		message.channel.send("Hej, jag är en bot som gamear på min fritid!")
	}
	else if (message.content.toLowerCase().includes("hur mycket är klockan")) {
		var currentdate = new Date(); 
		var datetime =  
			("0" + currentdate.getHours()).slice(-2) + ":"  
			+ ("0" + currentdate.getMinutes()).slice(-2) + ":" 
			+ ("0" + currentdate.getSeconds()).slice(-2)
		;
		message.channel.send(`Klockan är ${datetime}`);
	}
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