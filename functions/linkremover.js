const configModel = require("../models/configSchema");
module.exports = async (message) => {
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
        "870289214556758077", 
        "924078241344536607" //Twitch moderator
    ];
    const channels = ["754298054126993458", "813043346586730506", "521190821668716589","933058996301070336"];
    if (channels.find(c => c == message.channel.id)) return;
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
