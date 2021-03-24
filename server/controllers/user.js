const JWT = require("jsonwebtoken");
const User = require("../models/user");
const db = require("../database");

require("dotenv").config();

signToken = (user) => {
	return token = JWT.sign({
		iss: "Uni Blue",
		sub: user._id,
		iat: new Date().getTime(),
		exp: new Date().setDate(new Date().getDate() + 1),
	}, process.env.JWT_SECRET);
}

module.exports = {
	signup: async (req, res, next) => {
		const { username, email, password, authLevel } = req.value.body;

		const found = await User.findOne({ "email": email });
		if (found) {
			return res.status(403).json({ error: "Email in use" });
		}

		const newUser = new User({
			username: username,
			email: email,
			password: password,
			authLevel: authLevel
		})
		await newUser.save();
		db.execute("INSERT INTO userinfo (Email, Employee_Name, Employer_Name) VALUES (?, ?, ?)",[newUser.email, newUser.username, newUser.username]);
		const token = signToken(newUser);

		res.status(200).json({ 
			token: token,
			authLevel: newUser.authLevel,
			username: newUser.username
		});
	},

	login: async (req, res, next) => {
		const token = signToken(req.user);
		res.status(200).json({ 
			token: token,
			authLevel: req.user.authLevel,
			username: req.user.username
		});
	},

	get: async (req, res, next) => {
		
	}
}