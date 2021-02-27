const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
	prefix: { type: String, require: true},
	id: { type: Number, default: 0 },
	debug: { type: Boolean, default: false}
});

const model = mongoose.model("ConfigModel", configSchema);

const fetchConfig = async (id) => {
	configData = await model.findOne({ id: id });
	if (!configData) {
		let configData = await model.create({
			prefix: ".",
			id: id,
			debug: false
		});
		configData.save();
	}
	return configData;
};

module.exports = { configModel: model, fetchConfig };