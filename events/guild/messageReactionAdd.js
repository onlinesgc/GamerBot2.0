module.exports = async (Discord, client, reaction, user) => {
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
		reaction_action.do(client, Discord, reaction, user);
	}
}