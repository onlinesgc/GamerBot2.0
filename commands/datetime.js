const Discord = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    name: "time",
    aliases: [],
    description: "Get the current time in Sweden, Japan and Great Britain.",
    usage: [],
    perms: [],
    data: new SlashCommandBuilder()
        .setName("time")
        .setDescription("Get the current time in Sweden, Japan and Great Britain."),
    async do(message, args, profileData, isInteraction) {
        if(isInteraction){
            if(message.options._hoistedOptions[0] != null) args[0] = message.options._hoistedOptions[0].value;      
        }
        if(!isInteraction) return await message.channel.send({embeds:[get_time(message.client, message)]});
        else return message.editReply({embeds:[get_time(message.client, message)]});
    }
};

function get_time(client, message) {

    let sweden_time = new Date(); //Current date and time in Sweden (Stockholm)

    
    let miliseconds = sweden_time.getTime();

    let japan_time = new Date(miliseconds+(3600000*7)); //+7hrs for time in Tokyo

    let gb_time = new Date(miliseconds+(-3600000*1)); //-1hrs for time in London

    
    let sweden_time_string = ("0" + sweden_time.getHours()).slice(-2) + ":"
        + ("0" + sweden_time.getMinutes()).slice(-2) + ":"
        + ("0" + sweden_time.getSeconds()).slice(-2);

    let japan_time_string = ("0" + japan_time.getHours()).slice(-2) + ":"
        + ("0" + japan_time.getMinutes()).slice(-2) + ":"
        + ("0" + japan_time.getSeconds()).slice(-2);

    let gb_time_string = ("0" + gb_time.getHours()).slice(-2) + ":"
        + ("0" + gb_time.getMinutes()).slice(-2) + ":"
        + ("0" + gb_time.getSeconds()).slice(-2);


    let embed_fields = [
        { name: "Sweden:", value: sweden_time_string },
        { name: "Japan:", value: japan_time_string },
        { name: "Great Britain:", value: gb_time_string}
    ];

    const  embedded_message = new Discord.MessageEmbed()
          .setColor("#f54242")
          .setTitle(`time`)
          .setDescription(`Get the current time in Sweden, Japan and Great Britain.`)
          .addFields(
              embed_fields
          );
    return embedded_message;
}
