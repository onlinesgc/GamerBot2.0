module.exports = {
	name: "videosuggest_reactionswitcher",
	channels: ["809393742637170708", "815324315536326677"],
	async do(reaction, user, client) {
		const userReactions = reaction.message.reactions.cache.filter(reaction2 => reaction2.users.cache.has(user.id));
		
		if (reaction.emoji.name == "✅") {
			for (const reaction3 of userReactions.values()) {
				if (reaction3.emoji.name == "❌") {
					await reaction3.users.remove(user.id);
				}
			}
		} else if (reaction.emoji.name == "❌") {
			for (const reaction3 of userReactions.values()) {
				if (reaction3.emoji.name == "✅") {
					await reaction3.users.remove(user.id);
				}
			}
		}
	}
}