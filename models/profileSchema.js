const { Message } = require("discord.js");
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  serverID: { type: String, require: true },
  xp: { type: Number, default: 0 },
});

const model = mongoose.model("ProfileModels", profileSchema);

/**
 * Fetch the profile that corresponds to the userID and serverID
 * If no profile is found then it creates a profile with the userID and serverID
 * @param {Number} userID
 * @param {Number} serverID
 *
 * @returns The Profile Data
 */
const fetchProfile = async (userID, serverID) => {
  profile_data = await model.findOne({
    userID,
    serverID,
  });
  if (!profile_data) {
    let profile_data = await model.create({
      userID,
      serverID,
      xp: 0,
    });
    profile_data.save();
  }
  return profile_data;
};

/**
 * Returns the Profile Data for the user that sent the message in the server the message was sent.
 * @param {Message} message
 *
 * @returns The Profile Data
 */
const fetchProfileFromMessage = async (message) => {
  return fetchProfile(message.author.id, message.guild.id);
};

module.exports = { profileModel: model, fetchProfile, fetchProfileFromMessage };
