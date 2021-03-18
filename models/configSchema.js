const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
	prefix: { type: String, require: true},
	id: { type: Number, default: 0 },
	debug: { type: Boolean, default: false},
	username: { type: String },
	activity: { type: String },
	activityType: { type: String },
	xp: { type: Object, default: {
		timeoutsEnabled: true,
		xpHidden: true,
		xpTimeoutHidden: true,
		levelExponent: 2,
		levelBaseOffset: 0,
		levels: []
	}}
});

const model = mongoose.model("ConfigModel", configSchema);

const fetchConfig = async (id) => {
	let configData = await model.findOne({ id: id });
	if (!configData) {
		configData = await model.create({
			prefix: ".",
			id: id,
			debug: false,
			username: "GamerBot2.0",
			activity: "Testspel",
			activityType: "playing"
		});
		configData.save();
	}
	return configData;
};

module.exports = { configModel: model, fetchConfig };