const configModel = require("../models/configSchema");
module.exports = async (message) => {
    let configData = await configModel.fetchConfig(process.env.config_id);              //Retreive options
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
        "870289214556758077", 
        "924078241344536607" //Twitch moderator
    ];
    const allowdLink = [
        "https://www.dn.se/",
        "https://omni.se/",
        "https://www.expressen.se/",
        "https://www.aftonbladet.se/",
        "https://www.svd.se/",
        "https://www.svt.se/",
        "https://sverigesradio.se/",
        "https://www.tv4.se/",
        "https://svenska.yle.fi/",
        "https://edition.cnn.com/",
        "https://www.msnbc.com/",
        "https://www.bbc.com/news",
        "https://scratch.mit.edu/",
        "https://www.youtube.com/",
        "https://www.twitch.tv/",
        "https://github.com/",
        "https://gitlab.com/",
        "https://itch.io/",
        "https://docs.google.com/"
    ]; //Panik länkar
    const channels = ["754298054126993458", "813043346586730506", "521190821668716589","933058996301070336"];
    if (channels.find(c => c == message.channel.id)) return;

    if(message.channel.id == "897532538447339581" || message.channel.id == "949294374343303198"){ //Politik-hörnan and #dela-din-progress for the content-jam
        let isTrue = false;
        allowdLink.forEach(element =>{
            if(message.content.includes(element)) isTrue = true;
        })
        if(isTrue) return;
    }

    if(message.channel.type == "GUILD_NEWS_THREAD"||message.channel.type == "GUILD_PUBLIC_THREAD"||message.channel.type == "GUILD_PRIVATE_THREAD"){
        if (channels.find(c => c == message.channel.parent.id)) return;
    }
    let haveRole;
    roles.forEach(element => {
        if (message.member && message.member.roles) {
            if (message.member.roles.cache.get(element) == element) {
                haveRole = true;
                return;
            }
        }
    });
    if (haveRole) return;

    if (urlfind(message.content) != null) {
        message.delete()
        message.channel.send("Skicka inte länkar, tack!").then(msg => msg.delete({ timeout: 1000 * 5 }))
    }

    function urlfind(text) {
        const urlRegex = /((https?:\/\/)|(www\.)|(discord\.((com\/invite\/)|(gg\/)))[^\s]+)/g;
        return text.match(urlRegex);
    }
}
