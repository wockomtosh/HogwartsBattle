const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const characterSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	name: {
		type: String,
		default: "Harry Potter"
	},
	ap: {
		type: Number,
		default: 0
	},
	hp: {
		type: Number,
		default: 10
	},
	coins: {
		type: Number,
		default: 0
	},
	canDraw: {
		type: Boolean,
		default: true
	},
});

const Character = mongoose.model('Character', characterSchema);

//To make a character for a user
router.post('/', async (req, res) => {
	try {
		const existingCharacter = await Character.findOne({
			user: req.body.user._id,
		}).populate('user');
		if (existingCharacter)
			return res.status(403).send({
				message: "character for this user already exists"
			});
		//If the user doesn't already have a character, make one
		const character = new Character({
			user: req.body.user._id,
			name: req.body.name,
		});
		await character.save();

		return res.send({
			character: character
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.get('/', validUser, async (req, res) => {
	try {
		let character = await Character.findOne({
			user: req.user,
		}).populate('user');
		return res.send(character);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.put('/', validUser, async (req, res) => {
	try {
		const character = await Character.findOne({
			user: req.user,
		}).populate('user');

		character.ap = req.body.ap;
		character.hp = req.body.hp;
		character.coins = req.body.coins;
		character.canDraw = req.body.canDraw;
		await character.save();
		return res.send({
			character: character
		});

	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.delete('/', validUser, async (req, res) => {
	try {
		let character = await Character.deleteOne({
			user: req.user,
		});
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});


module.exports = {
	routes: router,
	model: Character,
};