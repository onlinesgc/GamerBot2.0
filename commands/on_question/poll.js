module.exports = {
	name: "poll",
	permittedMessages: ["poll"],
	description: "If a person has poll in message it adds reaction",
	perms: [],
	async do(message, args, profileData) {
        message.react("👍")
        message.react("👎")
	}
}