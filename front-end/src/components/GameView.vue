<template>
<div class="gameView">
	<div class="menu">
		<h2>{{user.username}} <a @click="logout"><i class="fas fa-sign-out-alt"></i></a></h2>
	</div>

	<div class="gameButtons">
		<button @click="newGame()">New Game</button>
		<button @click="continueGame()">Continue Game</button>
	</div>

	<Game v-if="gameStarted" :hand="hand" :villains="villains" :deck="deck" :character="character" />

</div>
</template>

<script>
import Game from '@/components/Game.vue';
import axios from 'axios';
export default {
	name: 'gameView',
	components: {
		Game,
	},
	data() {
		return {
			gameStarted: false,
			hand: null,
			deck: null,
			villains: null,
			character: null,
		}
	},
	async created() {
		let character = await axios.get("/api/characters/");
		if (character)
			this.continueGame()
		// this.gameStarted = false; //TODO remove this later
	},
	computed: {
		user() {
			return this.$root.$data.user;
		}
	},
	methods: {
		async logout() {
			try {
				await axios.delete("/api/users");
				this.$root.$data.user = null;
			} catch (error) {
				this.$root.$data.user = null;
			}
		},

		async newGame() {
			try {
				try {
					await axios.delete("/api/hands/");
				} catch (error) {
					console.log(error);
				}
				try {
					await axios.delete("/api/characters/");
				} catch (error) {
					console.log(error);
				}
				try {
					await axios.delete("/api/decks/");
				} catch (error) {
					console.log(error);
				}
				try {
					await axios.delete("/api/villains/");
				} catch (error) {
					console.log(error);
				}

				let response = await axios.post("/api/hands/", {
					user: this.user,
				});
				this.hand = response.data.hand;

				//TODO put card data instead of names
				let deck = await axios.post("/api/decks/", {
					user: this.user,
					drawPile: [{
						name: "Alohamora",
						type: "Spell",
						effect: [0],
						description: "Gain 1 Coin",
						canPlay: true
					}, {
						name: "Alohamora",
						type: "Spell",
						effect: [0],
						description: "Gain 1 Coin",
						canPlay: true
					}, {
						name: "Alohamora",
						type: "Spell",
						effect: [0],
						description: "Gain 1 Coin",
						canPlay: true
					}, {
						name: "Alohamora",
						type: "Spell",
						effect: [0],
						description: "Gain 1 Coin",
						canPlay: true
					}, {
						name: "Alohamora",
						type: "Spell",
						effect: [0],
						description: "Gain 1 Coin",
						canPlay: true
					}, {
						name: "Alohamora",
						type: "Spell",
						effect: [0],
						description: "Gain 1 Coin",
						canPlay: true
					}, {
						name: "Alohamora",
						type: "Spell",
						effect: [0],
						description: "Gain 1 Coin",
						canPlay: true
					}, {
						name: "Hedwig",
						type: "Ally",
						effect: [2, 2],
						description: "Gain 2 HP",
						canPlay: true
					}, {
						name: "Firebolt",
						type: "Item",
						effect: [1],
						description: "Gain 1 AP",
						canPlay: true
					}, {
						name: "Invisibility Cloak",
						type: "Item",
						effect: [1, 2],
						description: "Gain 1 AP and 1 HP",
						canPlay: true
					}]
				});
				this.deck = deck.data.deck;

				let character = await axios.post("/api/characters/", {
					user: this.user,
					name: "Harry Potter",
				});
				this.character = character.data.character;

				let villains = await axios.post("/api/villains/", {
					user: this.user,
					locations: ["Diagon Alley"],
					villainDeck: [{
							name: "Professor Quirrel",
							type: "Villain",
							effect: [6],
							description: "Lose 1 HP",
							ap: 0,
							hp: 6,
							reward: [0, 2, 4],
						},
						{
							name: "Draco Malfoy",
							type: "Villain",
							effect: [5],
							description: "Add 1 Control to the location",
							ap: 0,
							hp: 6,
							reward: [4, 4],
						},
						{
							name: "Crabbe and Goyle",
							type: "Villain",
							effect: [7],
							description: "Discard a Card",
							ap: 0,
							hp: 5,
							reward: [3, 3],
						},
					],
					darkArtsDeck: [""], //TODO fill this out
				});
				this.villains = villains.data.villain;

				if (this.villains.locations.length > 0) {
					let location = this.villains.locations.shift();
					this.villains.currentLocation = location;
				}

				this.gameStarted = true;
			} catch (error) {
				console.log(error);
			}

		},
		async continueGame() {
			try {
				let hand = await axios.get("/api/hands/");
				this.hand = hand.data;

				let deck = await axios.get("/api/decks/");
				this.deck = deck.data;

				let character = await axios.get("/api/characters/");
				this.character = character.data;

				let villains = await axios.get("/api/villains/");
				this.villains = villains.data;

				if (this.villains.locations.length > 0) {
					let location = this.villains.locations.shift();
					this.villains.currentLocation = location;
				}

				this.gameStarted = true;
			} catch (error) {
				console.log(error);
			}
		}
	}
}
</script>


<style scoped>
.menu {
	display: flex;
	justify-content: flex-end;
}

.menu h2 {
	font-size: 14px;
	padding-right: 20px;
}

.gameButtons {
	margin-top: 10px;
}

button {
	margin: 5px;
}
</style>
