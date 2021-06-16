const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const villainSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	locations: Array,
	villainDeck: Array,
	darkArtsDeck: Array,
	hand: {
		type: Array,
		default: []
	},
	discard: {
		type: Array,
		default: []
	},
	currentLocation: {
		type: String,
		default: ''
	},
	control: {
		type: Number,
		default: 0
	},
	activeVillains: {
		type: Array,
		default: []
	},
});

const Villain = mongoose.model('Villain', villainSchema);

//To make a villain set for a user
router.post('/', async (req, res) => {
	try {
		const existingVillain = await Villain.findOne({
			user: req.body.user._id,
		}).populate('user');
		if (existingVillain)
			return res.status(403).send({
				message: "villain set for this user already exists"
			});
		//If the user doesn't already have a villain, make one
		const villain = new Villain({
			user: req.body.user._id,
			locations: req.body.locations,
			villainDeck: req.body.villainDeck,
			darkArtsDeck: req.body.darkArtsDeck,
		});
		await villain.save();

		return res.send({
			villain: villain
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.get('/', validUser, async (req, res) => {
	try {
		let villain = await Villain.findOne({
			user: req.user,
		}).populate('user');
		return res.send(villain);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.put('/', validUser, async (req, res) => {
	try {
		const villain = await Villain.findOne({
			user: req.user,
		}).populate('user');

		villain.locations = req.body.locations;
		villain.villainDeck = req.body.villainDeck;
		villain.darkArtsDeck = req.body.darkArtsDeck;
		villain.hand = req.body.hand;
		villain.discard = req.body.discard;
		villain.currentLocation = req.body.currentLocation;
		villain.control = req.body.control;
		villain.activeVillains = req.body.activeVillains;

		await villain.save();
		return res.send({
			villain: villain
		});

	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.delete('/', validUser, async (req, res) => {
	try {
		let villain = await Villain.deleteOne({
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
	model: Villain,
};