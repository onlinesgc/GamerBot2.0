const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
	prefix: { type: String, require: true},
	id: { type: Number, default: 0 },
	debug: { type: Boolean, default: false}
});

const model = mongoose.model("ConfigModel", configSchema);

module.exports = model;