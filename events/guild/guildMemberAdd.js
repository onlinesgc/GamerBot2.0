const { fetchProfile } = require("../../models/profileSchema");
const { GuildMember } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async do(member, client) {
    // fetching a profile adds the user
    await fetchProfile(member.id, member.guild.id);
  },
};
