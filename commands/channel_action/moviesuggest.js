module.exports = {
	name: "moviesuggest",
	channels: ["816225717787689001", "816724246557884516"],
	async do(client, message, Discord, profileData) {
		message.react("👍");
		message.react("👎");
	}
}