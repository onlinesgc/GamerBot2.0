const profileModel = require("../../models/profileSchema");

module.exports = async (Interaction, client) => {
  if (!Interaction.isCommand()) return;
  const command = client.commands.get(Interaction.commandName)
  if (!command) return;
  let profileData = await profileModel.fetchProfile(Interaction.user.id, Interaction.guildId, Interaction.createdTimestamp, Interaction.createdTimestamp);
  try {
    await command.do(Interaction, [], profileData, true);
  } catch (error) {
    console.error(error);
    await Interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
}