const functions = require("../../functions");
const guildConfig = require("../../models/guildConfigSchema");
var Counter = 0;
var timeOut = false;
module.exports =  {
	countMessage(message){
        if(timeOut==false){
            Counter++;
            timeOut = true;
            if(Counter == 10) this.cardSendChance(message);
            setTimeout(()=>{
                timeOut = false;
            },1000 * 30)
        }
    },
    cardSendChance(message){
        var guildConfigData = guildConfig.fetchGuildConfig(message.guild.id);
        var randomInt = functions.getRandomIntRange(0,10);
        
    }
}