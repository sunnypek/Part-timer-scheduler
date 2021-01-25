const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
	authLevel: {
		type: String,
		enum: ["user", "admin"],
		required: true,
	},
	email: {
		type: String,
		lowercase: true,
	},
	password: String
});

UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
		next();
	} catch (error) {
		next(error);
	}
});

UserSchema.methods.isValidPassword = async function (inputPassword) {
	try {
		return await bcrypt.compare(inputPassword, this.password);
	} catch (error) {
		throw new Error(error);
	}
}

const User = mongoose.model("user", UserSchema);

module.exports = User;