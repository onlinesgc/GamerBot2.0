const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
	roleID: { type: String, require: true, unique: true},
	xpboost: { type: Object, default: {
		multiplier: 1,
		stopBoostTimestamp: null
	}}
});

const model = mongoose.model("RoleModels", roleSchema);

const fetchRole = async (roleID) => {
	let roleData = await model.findOne({ roleID: roleID });
	if (!roleData) {
		roleData = await model.create({
			roleID: roleID,
			
		});
		await roleData.save();
	}
	return roleData;
};

const fetchAll = async (filter) => {
	filter = filter || {};
	let roles = model.find(filter);
	return roles;
};

module.exports = { profileModel: model, fetchRole, fetchAll };
