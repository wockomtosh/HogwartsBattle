<template>
<div class="main">
	<div class="menu">
		<button @click="leaveGame()">Exit Game</button>
		<button @click="saveGame()">Save Game</button>
	</div>
	<br />
	<div class="menu">
		<button @click="endTurn()">End Turn</button>
	</div>

	<div v-if="won">
		<h1>You Win!</h1>
		<br />
	</div>

	<div v-if="lost">
		<h1>You Lose!</h1>
		<br />
	</div>

	<div>
		<h1>Location</h1>
		<div class="displayCard">
			<div class="card">
				<h2>Name: {{this.villains.currentLocation}}</h2>
				<h3>Control: {{this.villains.control}} / 10</h3>
			</div>
		</div>
		<button @click="addControl()">Add Control</button>
		<button @click="removeControl()">Remove Control</button>
	</div>

	<div class="villainsDisplay">
		<div>
			<h1>Dark Arts Cards</h1>
			<div class="darkArts cards" v-for="card in villains.hand" v-bind:key="card._id">
				<div class="card">
					<h2>{{card.name}}</h2>
					<p>{{card.description}}</p>
				</div>
			</div>
		</div>

		<div>
			<h1>Villains</h1>
			<div class="villains cards">
				<div v-for="villain in villains.activeVillains" v-bind:key="villain._id">
					<div class="card">
						<h2>{{villain.name}}</h2>
						<p>{{villain.description}}</p>
						<h3>AP: {{villain.ap}} / {{villain.hp}}</h3>
						<button @click="assignAP(villain)">Assign AP</button>
					</div>
				</div>
			</div>
			<button @click="defeatVillain()">Defeat Villain</button>
		</div>
	</div>

	<h1>Character</h1>
	<div class="displayCard">
		<div class="card">
			<h2>Name: {{this.character.name}}</h2>
			<h3>HP: {{character.hp}} / 10</h3>
			<div class="characterInfo">
				<h3>Coins: {{this.character.coins}}</h3>
				<h3>AP: {{this.character.ap}}</h3>
			</div>
		</div>
		<div>
			<button @click="addHP()">Add HP</button>
			<button @click="removeHP()">Remove HP</button>
		</div>
		<div>
			<button @click="addCoin()">Add Coin</button>
			<button @click="addAP()">Add AP</button>
		</div>
	</div>

	<h1>Hand</h1>
	<div class="cards">
		<div v-for="card in hand.cards" v-bind:key="card._id">
			<div class="card playable">
				<h2>{{card.name}}</h2>
				<h3>{{card.type}}</h3>
				<p>{{card.description}}</p>
				<h3>{{card.cost}}</h3>
				<button @click="selectCard(card)">Select</button>
			</div>
		</div>
	</div>
	<button @click="playCard()">Play Current Card</button>

</div>
</template>


<script>
import axios from 'axios';
export default {
	name: 'Game',
	props: {
		hand: Object,
		deck: Object,
		villains: Object,
		character: Object,
	},
	data() {
		return {
			currentCard: null,
			lost: false,
		}
	},
	created() {
		if (this.villains.activeVillains.length == 0) {
			this.revealVillain();
		}
		this.revealLocation();
	},
	computed: {
		user() {
			return this.$root.$data.user;
		},
		won() {
			return this.villains.villainDeck.length == 0 && this.villains.activeVillains == 0;
		},
	},
	methods: {
		selectCard(card) {
			this.currentCard = card;
		},
		playCard() {
			if (this.currentCard) {
				let effect = this.currentCard.effect;
				console.log("Activating Effect");
				console.log(effect);
				this.activateEffect(effect);
			}
		},
		activateEffect(effect) {
			for (let i = 0; i < effect.length; i++) {
				switch (effect[i]) {
					case 0:
						this.addCoin();
						break;
					case 1:
						this.addAP();
						break;
					case 2:
						this.addHP();
						break;
					case 3:
						this.draw();
						break;
					case 4:
						this.removeControl();
						break;
					case 5:
						this.addControl();
						break;
					case 6:
						this.removeHP();
						break;
					case 7:
						this.discard();
						break;
				}
			}
		},
		addCoin() {
			this.character.coins++;
		},
		addAP() {
			this.character.ap++;
		},
		addHP() {
			if (this.character.hp < 10)
				this.character.hp++;
		},
		draw() {
			if (this.character.canDraw) {
				if (this.deck.drawPile.length == 0) {
					this.reshuffle();
				}
				let card = this.deck.drawPile.shift();
				this.hand.cards.push(card);
			}
		},
		removeControl() {
			if (this.villains.control > 0)
				this.villains.control--;
		},
		addControl() {
			if (this.villains.control < 10)
				this.villains.control++;
		},
		removeHP() {
			if (this.character.hp > 0)
				this.character.hp--;
		},
		discard() {
			if (this.hand.cards.length > 0) {
				let card = this.hand.cards.shift(card);
				this.deck.discardPile.push(card);
			}
		},
		assignAP(villain) {
			if (this.character.ap > 0 && villain.ap < villain.hp) {
				villain.ap++;
				this.character.ap--;
			}
		},
		endTurn() {
			if (this.villains.control == 10)
				this.lost = true;

			if (this.character.hp == 0) {
				this.character.hp = 10;
			}
			this.character.ap = 0;
			this.character.coins = 0;
			this.discardAll();

			this.character.canDraw = true;
			for (let i = 0; i < 5; i++) {
				this.draw();
			}

			if (this.villains.activeVillains.length == 0) {
				this.revealVillain();
			}

			this.playDarkArts();
			this.activateVillains();
		},
		stunned() {
			this.discard();
			this.discard();
			this.character.ap = 0;
			this.character.coins = 0;
			this.addControl();
		},
		reshuffle() {
			while (this.deck.discardPile.length > 0) {
				let card = this.deck.discardPile.shift();
				this.deck.drawPile.push(card);
			}
		},
		discardAll() {
			while (this.hand.cards.length != 0) {
				this.discard();
			}
		},

		playDarkArts() {},
		activateVillains() {
			console.log(this.villains.activeVillains);
			let villain = this.villains.activeVillains[0];
			console.log(villain);
			console.log("Activating Effect");
			console.log(villain.effect);
			this.activateEffect(villain.effect);
		},
		revealVillain() {
			if (this.villains.villainDeck.length > 0) {
				let villain = this.villains.villainDeck.shift();
				this.villains.activeVillains.push(villain);
			}
		},
		revealLocation() {
			if (this.villains.locations.length > 0) {
				let location = this.villains.locations.shift();
				this.villains.currentLocation = location;
			}
		},
		defeatVillain() {
			let villain = this.villains.activeVillains[0];
			if (villain.ap == villain.hp) {
				this.villains.activeVillains.shift();
				console.log("Activating Effect");
				console.log(villain.reward);
				this.activateEffect(villain.reward);
			}
		},

		leaveGame() {
			this.gameStarted = false;
		},

		async saveGame() {
			await axios.put("/api/characters/", {
				ap: this.character.ap,
				hp: this.character.hp,
				coins: this.character.coins,
				canDraw: this.character.canDraw,
			})
		},
	}
}
</script>

<style scoped>
h1,
h2,
h3 {
	padding: 0;
	margin: 0;
}

.menu {
	display: flex;
	justify-content: flex-end;
}

.menu h2 {
	font-size: 14px;
	padding-right: 20px;
}

.villainsDisplay {
	display: flex;
	justify-content: space-around;
}

.displayCard {
	width: 50%;
	margin: 0 auto;
}

.characterInfo {
	display: flex;
	justify-content: space-around;
}

.cards {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.card {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	border: 1px solid;
	margin: 10px;
	padding: 5px;
}

.playable:hover {
	border: 3px solid;
}
</style>
