const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");

const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const date = require('date-and-time');
const uniqueValidator = require('mongoose-unique-validator');
const async = require('async');
const crypto = require('crypto');

const { notFound, errorHandler } = require("./middlewares");

require("dotenv").config();

mongoose.connect(process.env.DATABASE, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// const postSchema = {
// 	usernameField: String,
// 	entryDayTime: String,
// 	entryTimeZone: String,
// 	rawEntry: Number,
// 	exitDayTime: String,
// 	rawExit: Number,
// 	duration: String,
// 	complete: Boolean,
// 	createdAt: {
// 	  type: Date,
// 	  default: new Date()
// 	}
//   };

const corsOptions = {
	origin: "http://localhost:3000",
	optionsSuccessStatus: 200
}

const app = express();
const Post = mongoose.model('post', postSchema);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.get("/clock", (req, res) => {
	res.json({ message: "clock"});
});


app.get("/", (req, res) => {
	res.json({ message: "home"});
});

app.use("/users", require("./routes/users"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;