const {SlashCommandBuilder} = require("@discordjs/builders")
const http = require("http");
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
        http.get(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(calcString)}`, res=>{
            let data = [];
            res.on("data",chunk =>{
                data.push(chunk);
            })
            res.on("end", ()=>{
                let mathAnswer = Buffer.concat(data).toString();
                if(isInteraction) message.reply(mathAnswer);
                else message.channel.send(mathAnswer);
            })
        })

	}
}