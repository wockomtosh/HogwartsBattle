const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const handSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	cards: {
		type: Array,
		default: []
	}
});

const Hand = mongoose.model('Hand', handSchema);

//To make a hand for a user
router.post('/', async (req, res) => {
	try {
		const existingHand = await Hand.findOne({
			user: req.body.user._id
		}).populate('user');
		if (existingHand) {
			console.log("already exists");
			return res.status(403).send({
				message: "hand for this user already exists"
			});
		}
		//If the user doesn't already have a hand, make one
		const hand = new Hand({
			user: req.body.user._id,
		});
		await hand.save();

		return res.send({
			hand: hand
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.get('/', validUser, async (req, res) => {
	try {
		let hand = await Hand.findOne({
			user: req.user,
		}).populate('user');
		return res.send(hand);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.put('/', validUser, async (req, res) => {
	try {
		const hand = await Hand.findOne({
			user: req.user,
		}).populate('user');

		hand.cards = req.body.cards;
		await hand.save();
		return res.send({
			hand: hand
		});

	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.delete('/', validUser, async (req, res) => {
	try {
		let hand = await Hand.deleteOne({
			user: req.user,
		});
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
})


module.exports = {
	routes: router,
	model: Hand,
};