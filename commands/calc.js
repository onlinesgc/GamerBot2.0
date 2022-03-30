const {SlashCommandBuilder} = require("@discordjs/builders")
const http = require("http");
const {MessageEmbed } = require("discord.js");
module.exports = {
	name: "calc",
	aliases: [],
	description: "Du kan räkna matte med deta command",
	usage: [],
	perms: [],
	data: new SlashCommandBuilder()
		.setName("calc")
		.setDescription("Du kan räkna matte med deta command")
        .addStringOption((option) =>{
            return option.setName("tal").setDescription("Skriv in dit matte tal").setRequired(true)
        }),
	async do(message, args, profileData,isInteraction = false) {

        let calcString = (isInteraction == true) ? message.options._hoistedOptions[0].value : message.content.split("calc")[1];

        const embed = new MessageEmbed()
            .setColor("#68FE06")
            .setTitle(`${message.member.user.username} | Matte tal`)
            .setDescription(`Calculating ${"`"}${calcString.trim()}${"`"}`)
        let mathMessage; 
        if(isInteraction) mathMessage = await message.reply({embeds:[embed],fetchReply:true});
        else mathMessage = await message.channel.send({embeds:[embed]});

        http.get(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(calcString)}`, res=>{
            let data = [];
            res.on("data",chunk =>{
                data.push(chunk);
            })
            res.on("end", ()=>{
                let mathAnswer = Buffer.concat(data).toString();
                embed.setDescription(`Calculated ${"`"}${calcString.trim()}${"`"}\nAnswer ${"`"}${mathAnswer}${"`"}`)
                if(isInteraction) message.editReply({embeds:[embed]});
                else mathMessage.edit({embeds:[embed]});
            })
        })

	}
}