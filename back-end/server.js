const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// setup express
const app = express();

// setup body parser middleware to conver to JSON and handle URL encoded forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// connect to the mongodb database
mongoose.connect('mongodb://localhost:27017/hogwartsbattle', {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
	name: 'session',
	keys: [
		'secretValue'
	],
	cookie: {
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}
}));

const users = require("./users.js");
app.use("/api/users", users.routes);

const cards = require("./cards.js");
app.use("/api/cards", cards.routes);

const decks = require("./decks.js");
app.use("/api/decks", decks.routes);

const hands = require("./hands.js");
app.use("/api/hands", hands.routes);

const villains = require("./villains.js");
app.use("/api/villains", villains.routes);

const characters = require("./characters.js");
app.use("/api/characters", characters.routes);

app.listen(3002, () => console.log('Server listening on port 3002!'));