module.exports = {
	name: "dateget",
	permittedMessages: ["vilket datum är det"],
	description: "Gets the current date!",
	perms: [],
	async do(message, args, profileData) {
		const days = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
		const months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "november", "december"];
		var currentdate = new Date();
		var string = `Idag är det ${days[currentdate.getDay()]}en den ${currentdate.getDate()} ${months[currentdate.getMonth()]} ${currentdate.getFullYear()}.`;
		message.channel.send(string);
	}
}