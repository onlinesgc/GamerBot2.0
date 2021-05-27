const configModel = require("./models/configSchema");
const functions = require("./functions");
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
			"821043682970697818",
			"821044349290807326"
		];
		const channels = ["754298054126993458", "813043346586730506"];
		if (channels.find(c => c == message.channel.id)) return;
		let haveRole;
		roles.forEach(element => {
			if(message.member && message.member.roles){
				if (message.member.roles.cache.get(element) == element) {
					haveRole = true;
					return;
				}
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
		const {google} = require("googleapis"); //gets the google api
		const {ApiClient} = require("twitch");
		const {ClientCredentialsAuthProvider} = require("twitch-auth");
		client.setInterval(async function(){ //Loocks for a new vid once per 10 mins. Google api max request per day is 10 000.
			var ytInfo = await executeGoogle();  //gets the id of the latest vid
			let configData = await configModel.fetchConfig(process.env.config_id);
			if(ytInfo.data.items.length > 0){
				var id = ytInfo.data.items[0].id.videoId
				var title = ytInfo.data.items[0].snippet.title;
				if(configData.latestVideoId == "")//Loocks if the first vid hasen't been set to enything
				{
					configData.latestVideoId = id;
					configData.save();
					client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`STAMSITE har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${title}]** <@&813098115934191626>\n http://www.youtube.com/watch?v=${id}`);
				}
				if(configData.latestVideoId != id){ // looks if the video has alredy been sent.
					configData.latestVideoId = id;
					configData.save();
					client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`STAMSITE har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${title}]** <@&813098115934191626>\n http://www.youtube.com/watch?v=${id}`);
				}
				var twInfo = await executeTwitch();
				if(twInfo != null){
					if(twInfo.id != configData.latestLiveStreamId){
						client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`STAMSITE har gått live!\n**[${twInfo.title}]**<@&813098115934191626>\n https://www.twitch.tv/stamsite`);
						configData.latestLiveStreamId = twInfo.id;
						configData.save();
					}
				}
			}
		}, 1000 * 60 * 15);	
		async function executeGoogle(){
			var resId;
			yt = await google.youtube({
				version : "v3",
				auth : process.env.youtube_token //the youtube API key
			});
			let thisDay = await new Date();
			let Yesterday = `${thisDay.getFullYear()}-${thisDay.getMonth() + 1}-${(thisDay.getDate()-1)}T00:00:00Z`;
			await yt.search.list({
				"channelId" : "UCOZr_fd45CDuyqQEPQZaqMA", //Stamsites channelId
				"order" : "date", //The latest vid
				"part" : "snippet", //What part it requests. The id.
			    "publishedAfter" : Yesterday
			}).then(await function(res) {
				//resId = res.data.items[0].id.videoId;
				resId = res;
			})
		
			return resId;
		}
		async function executeTwitch(){
			const clientId = process.env.twitch_token;
			const tokenID = process.env.twitch_secret;
			const authProvider = await new ClientCredentialsAuthProvider(clientId,tokenID);
			const apiclient = await new ApiClient({authProvider});
			const channel = await apiclient.helix.streams.getStreamByUserName("stamsite");
			return channel;
		}
	},
	async getProfilePotho(profileData,TimeOut,Xp,xpPercentage,iconUrl,username){
		const {createCanvas, loadImage, registerFont} = require("canvas");
		var whidth = 500;
        var hight = 800;
		registerFont("./canvas/Hard Compound.ttf",{family:"Hard_Compound"});
        const Profile = createCanvas(whidth,hight);
        const ProfileOptions = Profile.getContext("2d");
		if(profileData.colorHexCode == undefined){
			console.log("insde "+ profileData.colorHexCode);
			profileData.colorHexCode = "#787C75";
			profileData.save();
		}
        ProfileOptions.fillStyle = profileData.colorHexCode;
        ProfileOptions.fillRect(0,0,whidth,hight);
        await loadImage(iconUrl).then(img =>{
			ProfileOptions.fillStyle = "#5FDA18";
			ProfileOptions.fillRect((whidth/2)-135,70,270,270)
			ProfileOptions.fillStyle = profileData.colorHexCode;
			ProfileOptions.fillRect((whidth/2)-125,80,250,250)
            ProfileOptions.drawImage(img,(whidth/2) - 125,80,250,250);
        })
        ProfileOptions.font = "bold 50pt Hard_Compound"
        ProfileOptions.textAlign = "center"
        ProfileOptions.fillStyle = "#fff"
        ProfileOptions.fillText(username,(whidth/2), 400)
		ProfileOptions.font = "normal 40pt Hard_Compound"
		ProfileOptions.fillText(`Level: ${profileData.level-1}`,(whidth/2),500);
		//ProfileOptions.font = "normal 30pt sans"
		//ProfileOptions.fillText(`Progress:\n${progressBar} ${xpPercentage}%`,(whidth/2),630);
		var multiplier = 3.5;
		var fildBar = 100 * multiplier;
		var Bar = xpPercentage * multiplier;
		ProfileOptions.fillStyle = "#898C87"
		ProfileOptions.fillRect(70,550,fildBar,40);
		ProfileOptions.fillStyle = "#fff"
		ProfileOptions.fillRect(70,550,Bar,40);
		ProfileOptions.font = "normal 40pt Hard_Compound";
		ProfileOptions.fillText(`${xpPercentage}%`,(whidth/2),645);
		ProfileOptions.font = "normal 20pt Hard_Compound";
		if(Xp != "") ProfileOptions.fillText(Xp,(whidth/2),700);
		if(TimeOut != "") ProfileOptions.fillText(TimeOut,(whidth/2) ,730);
		await loadImage("./canvas/BackrundsFrame.png").then(img =>{
            ProfileOptions.drawImage(img,0,0,whidth,hight);
        })
        return Profile.toBuffer("image/png");
	}
}
