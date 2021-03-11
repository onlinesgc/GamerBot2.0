module.exports = {
	name: "clockemotion",
	permittedMessages: ["hur mår klockan"],
	description: "Gets the clocks emotions!",
	perms: [],
	async do(client, message, args, Discord) {
		message.channel.send("Klockan känner sig stressad för att så många frågar hur mycket den är! :disappointed_relieved:");
	}
}