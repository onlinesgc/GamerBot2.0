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
				+ ("0" + currentdate.getSeconds()).slice(-2)
				;
			message.channel.send(`Klockan är ${datetime}`);
		}
	}
}