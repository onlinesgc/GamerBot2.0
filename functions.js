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
			"821044349290807326",
			"870289214556758077"
		];
		const channels = ["754298054126993458", "813043346586730506","521190821668716589"];
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
		const {ApiClient, HttpStatusCodeError} = require("twitch");
		const {ClientCredentialsAuthProvider} = require("twitch-auth");
		
		setInterval(async function(){ 
			var configData = await configModel.fetchConfig(process.env.config_id);
			if(!configData.NotisSystemOn) return
			var vids = [];
			for(let i = 0 ; i < configData.NotisChannels.length; i++){
				await executeGoogle.getdad(configData.NotisChannels[i].id,async function(err, data){
					let channelId = await data.feed.id.split(":")[2];
					let id = await data.feed.entry[0].id.split(":")[2];
					let title = data.feed.entry[0].title;
					let ChannelName = data.feed.title;
					let obj = {
						id:id,
						title:title,
						ChannelName:ChannelName,
						channelId:channelId,
						mentionChannel:configData.NotisChannels[i].Notis
					}
					vids[i] = obj;
				})
			}
			
			setTimeout(async function(){
				configData.latestVideoId = vids;
				let uppdatedVid = false;
				const fs = require("fs")
				fs.readFile("./videos/videos.json",'utf8', async(err,data) => {
					if(err){
						await fs.writeFile("./videos/videos.json",(err, data2) =>{
							if(err) return console.log(err);
							data = data2;
						});
					}
					data = await JSON.parse(data);
					for(let i = 0 ; i < vids.length; i++){
						if(data[i] == undefined) {
							data[i] = {
								id:"",
								title:"",
								ChannelName:""
							}
						}
						if(data[i].id != vids[i].id){
							uppdatedVid = true;
							if(vids[i].mentionChannel == true){
								client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`${vids[i].ChannelName} har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${vids[i].title}]** <@&813098115934191626>\n http://www.youtube.com/watch?v=${vids[i].id}`)
							}
							else{
								client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`${vids[i].ChannelName} har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${vids[i].title}]**\n http://www.youtube.com/watch?v=${vids[i].id}`)
							}
						}
					}
					if(uppdatedVid) {
						await configData.save();
						console.log("Ny vid")
						fs.writeFile("./videos/videos.json",JSON.stringify(vids, null, 2),(err) =>{
							if(err) return console.log(err);
						})
					}
				})
			}, 5000)
			var twInfo = await executeTwitch();
			if(twInfo != null){
				if(twInfo.id != configData.latestLiveStreamId){
					client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`STAMSITE har gått live!\n**[${twInfo.title}]**<@&813098115934191626>\n https://www.twitch.tv/stamsite`);
					configData.latestLiveStreamId = twInfo.id;
					configData.save();
				}
			}
		}, 1000 * 30);	
		var executeGoogle = (function(){
			const request = require("request");
			let xmlparser = require("xml2json");
			var fun = {}
			fun.getdad = function(channel,callback){
				request(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`, async function(err, rep, body){
					if(err) return console.log(err);
					body = await xmlparser.toJson(body,{object:true});
					callback(null,body)
				})
			}
			return fun;
		})()
		async function executeTwitch(){
			const clientId = process.env.twitch_token;
			const tokenID = process.env.twitch_secret;
			const authProvider = await new ClientCredentialsAuthProvider(clientId,tokenID);
			const apiclient = await new ApiClient({authProvider});
			const channel = await apiclient.helix.streams.getStreamByUserName("stamsite");
			return channel;
		}
	},
	async getProfilePotho(profileData,TimeOut,Xp,xpPercentage,iconUrl,username,ProfileFrame){
		const {createCanvas, loadImage, registerFont} = require("canvas");
		var whidth = 500;
        var hight = 800;
		registerFont("./canvas/Hard Compound.ttf",{family:"Hard_Compound"});
        const Profile = createCanvas(whidth,hight);
        const ProfileOptions = Profile.getContext("2d");
        ProfileOptions.fillStyle = profileData.colorHexCode;
        ProfileOptions.fillRect(0,0,whidth,hight);

		if(iconUrl != undefined){
			await loadImage(iconUrl).then(img =>{
				ProfileOptions.fillStyle = "#5FDA18";
				roundRect(ProfileOptions,(whidth/2)-135,70,270,270,20,true)
				ProfileOptions.fillStyle = profileData.colorHexCode;
				ProfileOptions.fillRect((whidth/2)-125,80,250,250)
				ProfileOptions.drawImage(img,(whidth/2) - 125,80,250,250);
			})
		}
        ProfileOptions.font = "bold 50pt Hard_Compound"
        ProfileOptions.textAlign = "center"
        ProfileOptions.fillStyle = "#fff"
        ProfileOptions.fillText(username,(whidth/2), 400)
		ProfileOptions.font = "normal 40pt Hard_Compound"
		ProfileOptions.fillText(`Level: ${profileData.level-1}`,(whidth/2),470);
		//ProfileOptions.font = "normal 30pt sans"
		//ProfileOptions.fillText(`Progress:\n${progressBar} ${xpPercentage}%`,(whidth/2),630);
		var multiplier = 3.5;
		var fildBar = 100 * multiplier;
		var Bar = xpPercentage * multiplier;
		ProfileOptions.fillStyle = "#898C87"
		roundRect(ProfileOptions,70,500,fildBar,40,15, true);
		ProfileOptions.fillStyle = "#fff"
		roundRect(ProfileOptions,70,500,Bar,40,15, true);
		ProfileOptions.font = "normal 40pt Hard_Compound";
		ProfileOptions.fillText(`${xpPercentage}%`,(whidth/2),600);
		ProfileOptions.font = "normal 20pt Hard_Compound";
		if(Xp != "") ProfileOptions.fillText(Xp,(whidth/2),700);
		if(TimeOut != "") ProfileOptions.fillText(TimeOut,(whidth/2) ,730);
		await loadImage(`./canvas/Backrounds/BackrundsFrame${ProfileFrame}.png`).then(img =>{
            ProfileOptions.drawImage(img,0,0,whidth,hight);
        })
        return Profile.toBuffer("image/png");
		function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
			if (typeof stroke === 'undefined') {
			  stroke = true;
			}
			if (typeof radius === 'undefined') {
			  radius = 5;
			}
			if (typeof radius === 'number') {
			  radius = {tl: radius, tr: radius, br: radius, bl: radius};
			} else {
			  var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
			  for (var side in defaultRadius) {
				radius[side] = radius[side] || defaultRadius[side];
			  }
			}
			ctx.beginPath();
			ctx.moveTo(x + radius.tl, y);
			ctx.lineTo(x + width - radius.tr, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
			ctx.lineTo(x + width, y + height - radius.br);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
			ctx.lineTo(x + radius.bl, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
			ctx.lineTo(x, y + radius.tl);
			ctx.quadraticCurveTo(x, y, x + radius.tl, y);
			ctx.closePath();
			if (fill) {
			  ctx.fill();
			}
			if (stroke) {
			  ctx.stroke();
			}
		}
	}
}
