const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();

const cardSchema = new mongoose.Schema({
	name: String,
	type: String,
	canPlay: {
		type: Boolean,
		default: true
	},
	cost: {
		type: Number,
		default: 0
	},
	effect: Array,
	description: String,
});

const Card = mongoose.model('Card', cardSchema);

//To make a new card
router.post('/', async (req, res) => {
	if (!req.body.name || !req.body.type || !req.body.effect || !req.body.description)
		return res.status(400).send({
			message: "name, type, description, and effect are required"
		});

	try {
		const existingCard = await Card.findOne({
			name: req.body.name
		});
		if (existingCard)
			return res.status(403).send({
				message: "card already exists"
			});

		const card = new Card({
			name: req.body.name,
			type: req.body.type,
			effect: req.body.effect,
			cost: req.body.cost,
			description: req.body.description
		});
		await card.save();

		return res.send({
			card: card
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

router.get('/:name', async (req, res) => {
	try {
		let card = await Card.findOne({
			name: req.params.name
		});
		return res.send(card);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});


module.exports = {
	routes: router,
	model: Card,
};