module.exports = {
	name: "setcolor",
	aliases: ["color","changecolor"],
	description: "Ändrar färgen av .me backround",
	usage: [
        `För att ändra din färg skriv .setcolor #"hexkåd"`,
        `För att få en hex kåd kan du gå till https://htmlcolorcodes.com/`
    ],
	perms: ["trustedCmd"],
	async do(message, args, profileData) {
        if(!args[0]){
            message.channel.send("Du måste skriva en hex kåd. Tex:#FFF");
            return;
        }else{
            if(!args[0].startsWith("#")){
                message.channel.send("Du måste skriva en hex-kod, t.ex: #FFF. Glöm inte #");
            }else{
                profileData.colorHexCode = args[0];
                profileData.save();
                message.channel.send("Din .me bakrunds färg är nu ändrad");
            }
        }
	}
}
