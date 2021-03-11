module.exports = {
	name: "moviesuggest_reactionswitcher",
	channels: ["816225717787689001", "816724246557884516"],
	async do(client, Discord, reaction, user) {
		const userReactions = reaction.message.reactions.cache.filter(reaction2 => reaction2.users.cache.has(user.id));
		
		if (reaction.emoji.name == "👍") {
			for (const reaction3 of userReactions.values()) {
				if (reaction3.emoji.name == "👎") {
					await reaction3.users.fetch();
					await reaction3.users.remove(user.id);
				}
			}
		} else if (reaction.emoji.name == "👎") {
			for (const reaction3 of userReactions.values()) {
				if (reaction3.emoji.name == "👍") {
					await reaction3.users.fetch();
					await reaction3.users.remove(user.id);
				}
			}
		}
	}
}