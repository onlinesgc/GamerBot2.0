
module.exports = {
	name: "setcolor",
	aliases: [],
	description: "Changes the color of .me backround",
	usage: [],
	perms: [],
	async do(message, args, profileData) {
        if(!args[0]){
            message.channel.send("Du måste skriva en hex kåd. Tex:#FFF");
            return;
        }else{
            if(!args[0].startsWith("#")){
                message.channel.send("Du måste skriva en hex kåd. Tex:#FFF Glömm inte #");
            }else{
                profileData.colorHexCode = args[0];
                profileData.save();
                message.channel.send("Din .me bakrunds färg är nu ändrad");
            }
        }
	}
}