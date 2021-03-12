module.exports = {
	name: "moviesuggest",
	channels: ["816225717787689001", "816724246557884516"],
	async do(message, profileData) {
		message.react("👍");
		message.react("👎");
	}
}