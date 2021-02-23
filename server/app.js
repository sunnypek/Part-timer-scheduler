const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");

// const ejs = require('ejs');
// const session = require('express-session');
// const passport = require('passport');
// const passportLocalMongoose = require('passport-local-mongoose');
// const findOrCreate = require('mongoose-findorcreate');
// const date = require('date-and-time');
// const uniqueValidator = require('mongoose-unique-validator');
// const async = require('async');
// const crypto = require('crypto');

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
//const Post = mongoose.model('post', postSchema);

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.get("/clock", (req, res) => {
	res.json({ message: "clock"});
});

// app.get('/clock', function(req, res) {
// 	res.render('logged', {
// 	username: nameUser,
// 	finalDoc: finalDoc
// 	});
	
//   });

//   app.get('/logEntry/:date', function(req, res) {
// 	if (req.isAuthenticated()) {
// 	  const now = req.params.date;
// 	  const nowDayTime = now.substring(0, 25);
// 	  const timeZone = now.substring(25, now.length);
// 	  const rawNow = Date.now();
// 	  const post = new Post({
// 		username: nameUser,
// 		entryDayTime: nowDayTime,
// 		entryTimeZone: timeZone,
// 		rawEntry: rawNow,
// 		complete: false
// 	  });
// 	  post.save(function(err) {
// 		if (err) {
// 		  console.log(err);
// 		}
// 		res.redirect('/logged');
// 	  });
// 	} else {
// 	  res.redirect('/');
// 	}
//   });

//   app.get('/logExit/:date', function(req, res) {
// 	if (req.isAuthenticated()) {
// 	  const now = req.params.date;
// 	  const nowDayTime = now.substring(0, 25);
// 	  const timeZone = now.substring(25, now.length);
// 	  const rawNow = Date.now();
  
// 	  function convertMS(milliseconds) {
// 		var day, hour, minute, seconds;
// 		seconds = Math.floor(milliseconds / 1000);
// 		minute = Math.floor(seconds / 60);
// 		seconds = seconds % 60;
// 		hour = Math.floor(minute / 60);
// 		minute = minute % 60;
// 		day = Math.floor(hour / 24);
// 		hour = hour % 24;
// 		function pad(n) {
// 		  return n < 10 ? '0' + n : n;
// 		}
  
// 		return {
// 		  day: pad(day),
// 		  hour: pad(hour),
// 		  minute: pad(minute),
// 		  seconds: pad(seconds)
// 		};
// 	  }
  
// 	  Post.find({ username: nameUser }).exec(function(err, doc) {
// 		if (err) {
// 		  console.log(err);
// 		}
// 		const obj = doc[doc.length - 1];
// 		let dur = convertMS(rawNow - obj.rawEntry);
// 		const timeStr = dur.hour + ':' + dur.minute + ':' + dur.seconds;
  
// 		Post.findOneAndUpdate(
// 		  { _id: obj._id },
// 		  {
// 			$set: {
// 			  exitDayTime: nowDayTime,
// 			  rawExit: rawNow,
// 			  complete: true,
// 			  duration: timeStr
// 			}
// 		  },
// 		  { new: true } // return updated post
// 		).exec(function(err, post) {
// 		  if (err) {
// 			console.log(err);
// 		  }
// 		  res.redirect('/');
// 		});
// 	  });
// 	} else {
// 	  res.redirect('/');
// 	}
//   });

app.get("/", (req, res) => {
	res.json({ message: "home"});
});

app.use("/users", require("./routes/users"));
app.use("/database", require("./routes/database"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;