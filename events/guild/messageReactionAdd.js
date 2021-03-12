module.exports = async (reaction, user, client) => {
	if (user.bot) return;
	
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (err) {
			console.error('Something went wrong when fetching the message: ', err);
			return;
		}
	}

	for (test of reaction.message.reactions.cache.values()) {
		
	}

	const reaction_action = client.reaction_actions.find(object => object.channels.includes(reaction.message.channel.id));

	if (reaction_action) {
		reaction_action.do(reaction, user, client);
	}
}