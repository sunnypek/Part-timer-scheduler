const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const JWTStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local");

const User = require("./models/user");

require("dotenv").config();

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("authorization"),
	secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
	try {
		const user = await User.findById(payload.sub);
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
}));

passport.use(new LocalStrategy({
	usernameField: "email"
}, async (email, password, done) => {
	try {
		const user = await User.findOne({ "email": email });
		if (!user) {
			return done(null, false);
		}
		const valid = await user.isValidPassword(password);
		if (!valid) {
			return(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
}));