const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: [validator.isEmail, "must be a valid email"],
	},
	password: {
		type: String,
		required: true,
	},
	token: {
		type: String,
	},
	role: {
		type: String,
		enum: [userRoles.USER, userRoles.ADMIN],
		default: userRoles.USER,
	},
	avatar: {
		type: String,
		default: "uploads/profile.jpeg",
	},
});
module.exports = mongoose.model("User", userSchema);
