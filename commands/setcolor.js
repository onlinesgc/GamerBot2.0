const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "setcolor",
	aliases: ["color","changecolor"],
	description: "Ändrar färgen av .me backround",
	usage: [
        `För att ändra din färg skriv .setcolor #"hexkåd"`,
        `För att få en hex kåd kan du gå till https://htmlcolorcodes.com/`
    ],
	perms: ["trustedCmd"],
    data: new SlashCommandBuilder()
    .setName("setcolor")
    .setDescription("Ändrar färgen av .me backround")
    .addStringOption((option) =>{
        return option.setName("collor").setDescription("Ange en hex kåd som #fff eller #4EC41B (Glöm inte #)").setRequired(true)
    }),
	async do(message, args, profileData,isInteraction) {
        args[0] = message.options._hoistedOptions[0].value;
        if(!args[0]){
            message.channel.send("Du måste skriva en hex kåd. Tex:#FFF");
            return;
        }else{
            if(!args[0].startsWith("#")){
                if(!isInteraction) message.channel.send("Du måste skriva en hex-kod, t.ex: #FFF. Glöm inte #");
                else message.reply("Du måste skriva en hex-kod, t.ex: #FFF. Glöm inte #");
            }else{
                profileData.colorHexCode = args[0];
                profileData.save();
                if(!isInteraction) message.channel.send("Din .me bakrunds färg är nu ändrad");
                else message.reply("Din .me bakrunds färg är nu ändrad");
            }
        }
	}
}
