const functions = require("../functions")
const discord  = require("discord.js");

module.exports = {
	name: "setframe",
	aliases: ["setram","ram","frame"],
	description: "Med deta kommand så kan du ändra din ram",
	usage: [],
	perms: ["trustedCmd"],
	async do(message, args, profileData) {
		let frames = [//https://imgur.com/a/gfa7osM 
			"https://i.imgur.com/zVxJiz4.png",
			"https://i.imgur.com/T81IkJA.png",//temp
			"https://i.imgur.com/8ksQiru.png"//temp 
		]//the frames. It needs to be a link so they are upploaded to imgur.
		let index = 0; //local index
		let TimeOut, Xp, xpPercentage = 0;
		let embed = new discord.MessageEmbed()
			.setTitle("För att välja ram trycket du på ⏺️")
			.setImage(frames[index])
		var Photo = await message.channel.send(embed)
		await Photo.react("◀️");
		await Photo.react("⏺️");
		await Photo.react("▶️");
		let filter = (reaction, user) =>{ 
			return (reaction, user)
		}
		const collector = Photo.createReactionCollector(filter,{ dispose: true });
		collector.on("collect",async (reaction, user)=>{
			if(user.id != message.member.id) return;
			reaction.users.remove(user.id);	
			if(reaction.emoji.name == "◀️" && index != 0){
				index--;
			}
			if(reaction.emoji.name == "▶️" && index != frames.length -1){
				index++;
			}
			let embed = new discord.MessageEmbed()
			.setTitle("För att välja ram trycket du på ⏺️")
			.setImage(frames[index])
			Photo.edit(embed)
			if(reaction.emoji.name == "⏺️"){
				profileData.profileFrame = index;
				profileData.save();
				collector.stop();
				let embed = new discord.MessageEmbed()
					.setTitle("Du har nu ändradt din ram")
				Photo.edit(embed);
				Photo.reactions.removeAll()
			}
		})
	}
}
