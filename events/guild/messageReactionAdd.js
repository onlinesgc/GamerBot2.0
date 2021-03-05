module.exports = (Discord, client, reaction, user) => {
	if (user.bot) return;
	
	const reaction_action = client.reaction_actions.find(object => object.channels.includes(reaction.message.channel.id));

	if (reaction_action) {
		reaction_action.do(client, Discord, reaction, user);
	}
}