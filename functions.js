const configModel = require("./models/configSchema");
const {google} = require("googleapis");

module.exports = {
	msToString(input) {
		let totalSeconds = (input / 1000);
		let days = Math.floor(totalSeconds / 86400);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		let time = `${input} milliseconds`;
		if (days > 0) {
			time = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		} else if (days === 0 && hours > 0) {
			time = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		} else if (days === 0 && hours === 0 && minutes > 0) {
			time = `${minutes} minutes and ${seconds} seconds`;
		} else if (days === 0 && hours === 0 && minutes === 0 && seconds > 0) {
			time = `${seconds} seconds`;
		}
		if (days === 1) {
			time = time.replace("days", "day");
		}
		if (hours === 1) {
			time = time.replace("hours", "hour");
		}
		if (minutes === 1) {
			time = time.replace("minutes", "minute");
		}
		if (seconds === 1) {
			time = time.replace("seconds", "second");
		}
		return time;
	},
	checkIfMentioned(message) {
		if (message.mentions.users.first() === message.client.user) {
			return true;
		}
		return false;
	},
	getRandomIntRange(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	applyOptions(client, configData) {
		client.user.setUsername(configData.username);
		client.user.setActivity(configData.activity, { type: configData.activityType.toUpperCase() });
	},
	initWebserver(client) {
		const express = require('express');
		const app = express();
		const port = 3000;

		app.get('/', (req, res) => {
			res.send(`
				<img src=${client.user.avatarURL()}>
				This webpage is served as a test page to see if the bot is up and running!
			`);
		});
		app.listen(port, () => console.log(`Webserver listening at http://localhost:${port}`)).on("error", (err) => {
			console.log(`Failed to open web server with code: "${err.code}"`);
		});
	},
	async checkForLinks(message) {
		let configData = await configModel.fetchConfig(process.env.config_id);		//Retreive options
		if (!configData.removeLinks) return;
		
		const roles = [
			"812348382810210314",
			"520331216415621143",
			"809140620463439892",
			"813482380887064597",
			"821059798270214176",
			"818809151257575464",
			"812324460429836318",
			"821043692747358298",
			"821043682970697818"
		];
		const channels = ["754298054126993458", "813043346586730506"];
		if (channels.find(c => c == message.channel.id)) return;
		let haveRole;
		roles.forEach(element => {
			if (message.member.roles.cache.get(element) == element) {
				haveRole = true;
				return;
			}
		});
		if (haveRole) return;
		
		if (urlfind(message.content) != null) {
			message.delete()
			message.reply("Skicka inte länkar, tack!").then(msg => msg.delete({ timeout: 1000 * 5 }))
		}
		
		function urlfind(text) {
			const urlRegex = /((https?:\/\/)|(www\.)|(discord\.((com\/invite\/)|(gg\/)))[^\s]+)/g;
			return text.match(urlRegex);
		}
	},
	async ReloadVids(client){
		client.setInterval(async function(){ //Loocks for a new vid once per 10 mins. Google api max request per day is 10 000.

			
			let configData = await configModel.fetchConfig(process.env.config_id);
			let id = await execute;  //gets the id of the latest vid
			if(configData.latestVideoId == "")//Loocks if the first vid hasen't been set to enything
			{
				configData.latestVideoId = id;
				client.guilds.cache.get("813844220694757447").channels.cache.get("813844220694757451").send(`http://www.youtube.com/watch?v=${id}`);
			}
			if(configData.latestVideoId != id){ // looks if the video has alredy been sent.
				configData.latestVideoId = id;
				client.guilds.cache.get("813844220694757447").channels.cache.get("813844220694757451").send(`http://www.youtube.com/watch?v=${id}`);
			}
		}, 1000 * 60 * 10);	
		async function execute(){
			var resId;
			yt = await google.youtube({
				version:"v3",
				auth:"youtube api key" //the youtube API key
			});
			await yt.search.list({
				"channelId":"UCOZr_fd45CDuyqQEPQZaqMA", //Stamsites channelId
				"order":"date", //The latest vid
				"part":"id"//What part it requests. The id.
			}).then(await function(res) {
				resId = res.data.items[0].id.videoId;
			})
		
			return resId;
		}
	}
}