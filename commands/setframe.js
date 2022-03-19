const functions = require("../functions")
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	name: "setframe",
	aliases: ["setram", "ram", "frame"],
	description: "Med detta kommando kan du ändra din ram.",
	usage: [],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("setframe")
		.setDescription("Med detta kommando kan du ändra din ram."),
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
		var exclusiveFrames2 = [
			{ frameUrl: "https://i.imgur.com/lctjR3N.png", fileID: 10}, //raze-end winers 1  - 0
			{ frameUrl: "https://i.imgur.com/tT33FbV.png", fileID: 11}, //raze - smörevent 11 - 1 
			{ frameUrl: "https://i.imgur.com/frcctEf.png", fileID: 12}, //mod frame - 2
			{ frameUrl: "https://i.imgur.com/TlyTYIt.png", fileID: 13}, //memme master - 3
			{ frameUrl: "https://i.imgur.com/ufqLNzx.png", fileID: 14}, // level snubbe - 4
			{ frameUrl: "https://i.imgur.com/KxVrzuf.png", fileID: 15}, //serverboost? Pixi - 5 
			{ frameUrl: "https://i.imgur.com/MtTN87w.png", fileID: 16}, //hallown - 6 
			{ frameUrl: "https://i.imgur.com/7uYHaMp.png", fileID: 17}, // Gamerbot Ram - 7
			{ frameUrl: "https://i.imgur.com/WpnSNhl.png", fileID: 18}, //Vinnare bygg tävlning -8
			{ frameUrl: "https://i.imgur.com/Nf0rPzQ.png", fileID: 19}, // hallowen -9
			{ frameUrl: "https://i.imgur.com/IXvC6U3.png", fileID: 20}, //redit ram -10
			{ frameUrl: "https://i.imgur.com/Dd9yAAC.png", fileID: 21}, //jul ram - 11
			{ frameUrl: "https://i.imgur.com/upfjkDq.png", fileID: 22} //game jam - 12
		]
		if (profileData.exclusiveFrames == undefined) {
			profileData.exclusiveFrames = [];
			await profileData.save();
		}
		if (profileData.exclusiveFrames.length != 0) { //adds exlusive frames
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
			if (data.customId == "left") {
				if(index != 0) index--;
				else index = frames.length - 1;
			}
			if (data.customId == "right") {
				if(index != frames.length - 1) index++;
				else index = 0
			}
			let embed = new discord.MessageEmbed()
				.setTitle("För att välja ram trycker du på ⏺️")
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
					.setTitle("Du har nu ändrat din ram!")
					.setAuthor(message.member.user.username)
				if (!isInteraction) Photo.edit({ embeds: [embed], components: [row] });
				else message.editReply({ embeds: [embed], components: [row] })
				Photo.reactions.removeAll()
			}
		})
	}
}
