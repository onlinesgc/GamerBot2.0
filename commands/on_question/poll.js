module.exports = {
	name: "poll",
	permittedMessages: ["poll"],
	description: "If a person has poll in message it adds reaction",
	perms: [],
	async do(message, args, profileData) {
		const EMOJIREGEX = /((?<!\\)<:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu;

		var emojis = message.content.match(EMOJIREGEX);

		if(emojis == undefined) emojis = ["👍","👎"]
		
		emojis.forEach(async element => {
			if(/\d/.test(element)){
				message.guild.emojis.cache.forEach(emojiID =>{
					if(element.includes(emojiID.id) == true) message.react(element);
				})
			}
			else{
				await message.react(element)
			}
		});
	}
}