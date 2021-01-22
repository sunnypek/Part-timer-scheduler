const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const { notFound, errorHandler } = require("./middlewares");

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => {
	res.json({ message: "home"});
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;