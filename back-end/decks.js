const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const deckSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	drawPile: Array,
	discardPile: {
		type: Array,
		default: []
	}
});

const Deck = mongoose.model('Deck', deckSchema);

//To make a deck for a user
router.post('/', async (req, res) => {
	try {
		const existingDeck = await Deck.findOne({
			user: req.body.user._id,
		}).populate('user');
		if (existingDeck)
			return res.status(403).send({
				message: "deck for this user already exists"
			});
		//If the user doesn't already have a deck, make one
		const deck = new Deck({
			user: req.body.user._id,
			drawPile: req.body.drawPile,
		});
		await deck.save();

		return res.send({
			deck: deck
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.get('/', validUser, async (req, res) => {
	try {
		let deck = await Deck.findOne({
			user: req.user,
		}).populate('user');
		return res.send(deck);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.put('/', validUser, async (req, res) => {
	try {
		const deck = await Deck.findOne({
			user: req.user,
		}).populate('user');

		deck.drawPile = req.body.drawPile;
		deck.discardPile = req.body.discardPile;
		await deck.save();
		return res.send({
			deck: deck
		});

	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.delete('/', validUser, async (req, res) => {
	try {
		let deck = await Deck.deleteOne({
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
	model: Deck,
};