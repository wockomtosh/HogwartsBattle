const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
});

userSchema.pre('save', async function(next) {
	if (!this.isModified('password'))
		return next();

	try {
		const hash = await argon2.hash(this.password);
		this.password = hash;
		next();
	} catch (error) {
		console.log(error);
		next(error);
	}
});

userSchema.methods.comparePassword = async function(password) {
	try {
		const isMatch = await argon2.verify(this.password, password);
		return isMatch;
	} catch (error) {
		return false;
	}
};

userSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.password;
	return obj;
}

const User = mongoose.model('User', userSchema);

const validUser = async (req, res, next) => {
	if (!req.session.userID)
		return res.status(403).send({
			message: "not logged in"
		});
	try {
		const user = await User.findOne({
			_id: req.session.userID
		});
		if (!user) {
			return res.status(403).send({
				message: "not logged in"
			});
		}
		req.user = user;
	} catch (error) {
		return res.status(403).send({
			message: "not logged in"
		});
	}

	next();
};

router.post('/', async (req, res) => {
	// Make sure that the form coming from the browser includes all required fields,
	// otherwise return an error. A 400 error means the request was
	// malformed.
	if (!req.body.username || !req.body.password)
		return res.status(400).send({
			message: "username and password are required"
		});

	try {

		//  Check to see if username already exists and if not send a 403 error. A 403
		// error means permission denied.
		const existingUser = await User.findOne({
			username: req.body.username
		});
		if (existingUser)
			return res.status(403).send({
				message: "username already exists"
			});

		// create a new user and save it to the database
		const user = new User({
			username: req.body.username,
			password: req.body.password
		});
		await user.save();
		// set user session info
		req.session.userID = user._id;

		// send back a 200 OK response, along with the user that was created
		return res.send({
			user: user
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

// login a user
router.post('/login', async (req, res) => {
	// Make sure that the form coming from the browser includes a username and a
	// password, otherwise return an error.
	if (!req.body.username || !req.body.password)
		return res.sendStatus(400);

	try {
		//  lookup user record
		const user = await User.findOne({
			username: req.body.username
		});
		// Return an error if user does not exist.
		if (!user)
			return res.status(403).send({
				message: "username or password is wrong"
			});

		// Return the SAME error if the password is wrong. This ensure we don't
		// leak any information about which users exist.
		if (!await user.comparePassword(req.body.password))
			return res.status(403).send({
				message: "username or password is wrong"
			});

		// set user session info
		req.session.userID = user._id;

		return res.send({
			user: user
		});

	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

// get logged in user
router.get('/', validUser, async (req, res) => {
	try {
		res.send({
			user: req.user
		});
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});

// logout
router.delete("/", validUser, async (req, res) => {
	try {
		req.session = null;
		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
});


module.exports = {
	routes: router,
	model: User,
	valid: validUser
};