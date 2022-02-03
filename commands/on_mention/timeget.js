module.exports = {	
	name: "timeget",
	permittedMessages: ["hur mycket är klockan", "vad är klockan"],
	description: "Gets the current time!",
	perms: [],
	async do(message, args, profileData) {
		if (Math.floor(Math.random() * 100) > 91) {
			message.channel.send("**KLOCKAN TOLV!**")
		} else {
			var currentdate = new Date();
			var datetime =
				("0" + currentdate.getHours()).slice(-2) + ":"
				+ ("0" + currentdate.getMinutes()).slice(-2) + ":"
				+ ("0" + currentdate.getSeconds()).slice(-2);
			if( currentdate.getHours() == 13 && currentdate.getMinutes() == 37 && currentdate.getSeconds(37)) message.channel.send(`<a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594>**Klockan är 13:37:37!**<a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594><a:vibecat:813405042887491594>`)
			else message.channel.send(`Klockan är ${datetime}`);
		}
	}
}