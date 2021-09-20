const functions = require("../functions")
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "setframe",
	aliases: ["setram", "ram", "frame"],
	description: "Med deta kommand så kan du ändra din ram",
	usage: [],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("setframe")
		.setDescription("Med deta kommand så kan du ändra din ram"),
	async do(message, args, profileData, isInteraction) {
		let frames = [//https://imgur.com/a/gfa7osM 
			{ frameUrl: "https://i.imgur.com/zVxJiz4.png", fileID: 0 }, //orginal
			{ frameUrl: "https://i.imgur.com/fI1bZ3W.png", fileID: 1 }, //Vrile64
			{ frameUrl: "https://i.imgur.com/Gwtlbi8.png", fileID: 2 },//arre
			{ frameUrl: "https://i.imgur.com/WpjMGG0.png", fileID: 3 }, //snizard
			{ frameUrl: "https://i.imgur.com/6qMlNKs.png", fileID: 4 }, //lukasabbe
			{ frameUrl: "https://i.imgur.com/cYBWxKF.png", fileID: 5 },//Renen
			{ frameUrl: "https://i.imgur.com/j9nCDqr.png", fileID: 6 },//snizard
			{ frameUrl: "https://i.imgur.com/CQyzVpV.png", fileID: 7 },//snizard
			{ frameUrl: "https://i.imgur.com/pUTFUAM.png", fileID: 8 },//snizard
			{ frameUrl: "https://i.imgur.com/VvUSM3M.png", fileID: 9 }//pixi
		]//the frames. It needs to be a link so they are upploaded to imgur.
		let exclusiveFrames2 = [
			{ frameUrl: "https://i.imgur.com/lctjR3N.png", fileID: 10 }, //raze-end winers 10
			{ frameUrl: "https://i.imgur.com/tT33FbV.png", fileID: 11 } //raze - smörevent 11
		]
		if (profileData.exclusiveFrames == undefined) {
			profileData.exclusiveFrames = [];
			await profileData.save();
		}
		console.log(profileData.exclusiveFrames)
		if (profileData.exclusiveFrames.length != 0) {
			for (let i = 0; i < profileData.exclusiveFrames.length; i++) {
				frames.push(exclusiveFrames2[profileData.exclusiveFrames[i]])
			}
		}
		let index = 0; //local index
		let embed = new discord.MessageEmbed()
			.setTitle("För att välja ram trycker du på ⏺️")
			.setImage(frames[index].frameUrl)
			.setAuthor(message.member.user.username)
			.setFooter(`${index + 1}/${frames.length}`)
		const row = new discord.MessageActionRow()
			.addComponents(
				[
					new discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("◀️")
						.setCustomId("left"),
					new discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("⏺️")
						.setCustomId("pick"),
					new discord.MessageButton()
						.setStyle("SECONDARY")
						.setEmoji("▶️")
						.setCustomId("right"),
				]
			);
		var Photo;
		if (!isInteraction) Photo = await message.channel.send({ embeds: [embed], components: [row] })
		else Photo = await message.reply({ embeds: [embed], components: [row], fetchReply: true })
		let filter = data => {
			return data;
		}
		const collector = Photo.createMessageComponentCollector(filter, { dispose: true });
		collector.on("collect", async data => {
			if (data.user.id != message.member.id) return;
			data.deferUpdate()
			if (data.customId == "left" && index != 0) {
				index--;
			}
			if (data.customId == "right" && index != frames.length - 1) {
				index++;
			}
			let embed = new discord.MessageEmbed()
				.setTitle("För att välja ram trycket du på ⏺️")
				.setImage(frames[index].frameUrl)
				.setAuthor(message.member.user.username)
				.setFooter(`${index + 1}/${frames.length}`)
			if (!isInteraction) Photo.edit({ embeds: [embed] })
			else message.editReply({ embeds: [embed] })
			if (data.customId == "pick") {
				profileData.profileFrame = frames[index].fileID;
				profileData.save();
				await row.components.map(e => e.setDisabled(true))
				collector.stop();
				let embed = new discord.MessageEmbed()
					.setTitle("Du har nu ändradt din ram")
					.setAuthor(message.member.user.username)
				if (!isInteraction) Photo.edit({ embeds: [embed], components: [row] });
				else message.editReply({ embeds: [embed], components: [row] })
				Photo.reactions.removeAll()
			}
		})
	}
}
