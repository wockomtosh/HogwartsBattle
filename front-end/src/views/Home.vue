<template>
<div class="home">
	<h2>Welcome to Hogwarts Battle!</h2>
	<p>This is a stripped down version of Hogwarts Battle, a cooperative deck building game.
		Unfortunately, I don't have the time to make a fully-featured version of this game.
		However, this game is fully playable, and although it's a bit easy and overly simplified,
		it will suffice for this project.
	</p>
	<ul>
		<li>First, you need to create an account. You can use any username
			and password that hasn't already been taken.</li>
		<li>Second, press the "New Game" button. This will generate a new game
			for you and put it into the database.</li>
		<li>Third, press the "End Turn" button. This may seem a bit strange at first,
			but when you end your turn it automatically discards your hand, draws new cards,
			and enacts the villain abilities and rewards.</li>
		<li>Fourth, select a card. Once it's selected, you can press the "Play Current Card"
			button to gain its effect.</li>
		<li>Fifth, continue playing! You can play cards, defeat villains,
			and save your game if you want to take a break. You can even log out if you
			save and come back to your game. If you defeat all 3 villains, you win! But,
			if you allow the villains to gain 10 control on the location, you lose.
			You'll probably win ;) Have fun!
		</li>
	</ul>
</div>
</template>

<script>
export default {
	name: 'Home',
	components: {

	}
}
</script>

<style scoped>
p,
li {
	text-align: left;
}
</style>
