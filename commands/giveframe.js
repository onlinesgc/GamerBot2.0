const { SlashCommandBuilder } = require("@discordjs/builders")
const profileModel = require("../models/profileSchema");
module.exports = {
    name: "giveframe",
    aliases: [],
    description: "Admin command som ger ovanliga frames till användare",
    usage: [],
    perms: ["adminCmd"],
    data: new SlashCommandBuilder()
        .setName("giveframe")
        .setDescription("Admin command som ger ovanliga frames till användare")
        .addUserOption((option) => {
            return option.setName("user").setDescription("The user you want to give the frame to").setRequired(true)
        })
        .addStringOption((option) => {
            return option.setName("framename").setDescription("the number of the frame you want to give").setRequired(true)
        }),
    async do(message, args, profileData, isInteraction) {

        let member;
        let user;
        if (isInteraction) {
            member = message.options._hoistedOptions[0].member;
            args[1] = message.options._hoistedOptions[1].value;
            profileData = await profileModel.fetchProfile(member.id, message.guild.id);
        }
        else {
            if (!args[0]) {
                return message.channel.send("Du måste ange en person du vill ge frame till");
            } else {
                if (message.mentions.members.first()) {
                    member = message.mentions.members.first();
                    user = message.mentions.users.first();
                } else {
                    member = await message.guild.members.fetch(args[0]);
                    user = await message.client.users.fetch(args[0]);
                }
                profileData = await profileModel.fetchProfile(member.id, message.guild.id);
            }

        }
        if(!args[1]){
            return message.channel.send("Du måste skriva vilken frame du vill ge");
        }
        let y = false;
        await profileData.exclusiveFrames.forEach(element => {
            if(element == args[1]){
                y = true;
                if(!isInteraction) return message.channel.send("Du kan inte ge en frame som personen redan har");
                else message.editReply("Du kan inte ge en frame som personen redan har"); 
            }
        });
        if(!y){
            profileData.exclusiveFrames.push(args[1]);
            profileData.save();
            if(!isInteraction) return message.channel.send("Personen har fått " + args[1] + "!");
            else return message.editReply("Personen har fått " + args[1] + "!");   
        }
    }
}