const configModel = require("../models/configSchema");
const guildConfig = require("../models/guildConfigSchema");
const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const fs = require("fs");

module.exports = async (client) => {
    setInterval(async function () {
        var configData = await configModel.fetchConfig(process.env.config_id);
        if (!configData.NotisSystemOn) return;
        var vids = [];
        for(i = 0 ; i < configData.NotisChannels.length;i++){
            var videoData = await getYoutubeVideoData(configData.NotisChannels[i].id); // gets data

            //Splits out the importent data
            let channelId = await videoData.feed.id.split(":")[2];
            let id = await videoData.feed.entry[0].id.split(":")[2];
            let title = videoData.feed.entry[0].title;
            let ChannelName = videoData.feed.title;
            let obj = {
                id: id,
                title: title,
                ChannelName: ChannelName,
                channelId: channelId,
                mentionChannel: configData.NotisChannels[i].Notis
            }
            //saves all data to vids 
            vids.push(obj)
        }
        setTimeout(async function(){
            fs.readFile("./videos/videos.json", async (err,data) =>{
                if(err) console.log(err);
                data = await JSON.parse(data);
                client.guilds.cache.forEach(async guild =>{
                    let guildConfigData = await guildConfig.fetchGuildConfig(guild.id);
                    for(i = 0 ; i < vids.length;i++){
                        isNotNewVid = false;
                        data.forEach(element =>{
                            if(element == vids[i].id) isNotNewVid = true;
                        })
                        if(isNotNewVid) continue;
                        await data.push(vids[i].id);
                        if(guildConfigData.notificationChannel != ""){
                            if (vids[i].mentionChannel == true) {
                                await client.guilds.cache.get(guild.id).channels.cache.get(guildConfigData.notificationChannel).send(`${vids[i].ChannelName} har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${vids[i].title}]** <@&813098115934191626>\n http://www.youtube.com/watch?v=${vids[i].id}`).then(msg =>{
                                    if(msg.channel.type === "GUILD_NEWS") msg.crosspost();
                                })
                            }
                            else {
                                await client.guilds.cache.get(guild.id).channels.cache.get(guildConfigData.notificationChannel).send(`${vids[i].ChannelName} har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${vids[i].title}]** <@&955887503829774448>\n http://www.youtube.com/watch?v=${vids[i].id}`).then(msg =>{
                                    if(msg.channel.type === "GUILD_NEWS") msg.crosspost();
                                })
                            }
                        }
                    }
                })
                setTimeout(async function(){
                    fs.writeFile("./videos/videos.json",JSON.stringify(data),(err)=>{
                        if(err) console.log(err);
                    })
                },2000)
            })
            var twInfo = await executeTwitch();
            if (twInfo != null) {
                if (twInfo.id != configData.latestLiveStreamId) {
                    await client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`Stamsite har gått live!\n**[${twInfo.title}]**<@&813098115934191626>\n https://www.twitch.tv/stamsite`).then(msg =>{
                        if(msg.channel.type === "GUILD_NEWS") msg.crosspost();
                    })
                    configData.latestLiveStreamId = twInfo.id;
                    await configData.save();
                }
            }
        },1000 )
    }, 1000 * 10)

    function getYoutubeVideoData(channel) {
        const request = require("request");
        let xmlparser = require("xml2json");
        return new Promise(resolve => {
            request(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`, async function (err, rep, body) {
                if (err) return console.log(err);
                body = await xmlparser.toJson(body, { object: true });
                resolve(body)
            })
        })
    }
    async function executeTwitch() {
        const clientId = process.env.twitch_token;
        const tokenID = process.env.twitch_secret;
        const authProvider = await new ClientCredentialsAuthProvider(clientId, tokenID);
        const apiclient = await new ApiClient({ authProvider });
        const channel = await apiclient.helix.streams.getStreamByUserName("stamsite");
        return channel;
    }
}

/*
async ReloadVids(client) {
const { ApiClient, HttpStatusCodeError } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");

setInterval(async function () {
    var configData = await configModel.fetchConfig(process.env.config_id);
    if (!configData.NotisSystemOn) return
    var vids = [];
    for (let i = 0; i < configData.NotisChannels.length; i++) {
        await executeGoogle.getdad(configData.NotisChannels[i].id, async function (err, data) {
            let channelId = await data.feed.id.split(":")[2];
            let id = await data.feed.entry[0].id.split(":")[2];
            let title = data.feed.entry[0].title;
            let ChannelName = data.feed.title;
            let obj = {
                id: id,
                title: title,
                ChannelName: ChannelName,
                channelId: channelId,
                mentionChannel: configData.NotisChannels[i].Notis
            }
            vids[i] = obj;
        })
    }

    setTimeout(async function () {
        configData.latestVideoId = vids;
        let uppdatedVid = false;
        const fs = require("fs")
        fs.readFile("./videos/videos.json", 'utf8', async (err, data) => {
            data = await JSON.parse(data);
            for (let i = 0; i < vids.length; i++) {
                if (data[i] == undefined) {
                    data[i] = {
                        id: "",
                        title: "",
                        ChannelName: ""
                    }
                }
                if (data[i].id != vids[i].id) {
                    uppdatedVid = true;
                    if (vids[i].mentionChannel == true) {
                        //client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`${vids[i].ChannelName} har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${vids[i].title}]** <@&813098115934191626>\n http://www.youtube.com/watch?v=${vids[i].id}`)
                    }
                    else {
                        //client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`${vids[i].ChannelName} har lagt upp en ny video! <:Marcus_Pog:813821837976535060>\n**[${vids[i].title}]**\n http://www.youtube.com/watch?v=${vids[i].id}`)
                    }
                }
            }
            if (uppdatedVid) {
                await configData.save();
                console.log("Ny vid")
                fs.writeFile("./videos/videos.json", JSON.stringify(vids, null, 2), (err) => {
                    if (err) return console.log(err);
                })
            }
        })
    }, 5000)
    var twInfo = await executeTwitch();
    if (twInfo != null) {
        if (twInfo.id != configData.latestLiveStreamId) {
            client.guilds.cache.get("516605157795037185").channels.cache.get("814163313675730954").send(`STAMSITE har gått live!\n**[${twInfo.title}]**<@&813098115934191626>\n https://www.twitch.tv/stamsite`);
            configData.latestLiveStreamId = twInfo.id;
            configData.save();
        }
    }
}, 1000 * 60 * 5);
var executeGoogle = (function () {
    const request = require("request");
    let xmlparser = require("xml2json");
    var fun = {}
    fun.getdad = function (channel, callback) {
        request(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel}`, async function (err, rep, body) {
            if (err) return console.log(err);
            body = await xmlparser.toJson(body, { object: true });
            callback(null, body)
        })
    }
    return fun;
})()
async function executeTwitch() {
    const clientId = process.env.twitch_token;
    const tokenID = process.env.twitch_secret;
    const authProvider = await new ClientCredentialsAuthProvider(clientId, tokenID);
    const apiclient = await new ApiClient({ authProvider });
    const channel = await apiclient.helix.streams.getStreamByUserName("stamsite");
    return channel;
}
},
*/