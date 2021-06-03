Hogwarts Battle Online Game Docs

What are the essential elements of the game?
I'm going to start by only implementing year 1.
I'm going to start by only implementing 1 player.

Player - store everything about the game state here?
-name
-character
-deck
-hand
-discard
-hp
-ap (attack points)
-coins
-canDraw (for basilisk and petrification will just set canDraw to false at the beginning of the turn)
-stunned() this will add a skull, make the player discard half their cards, and discard their tokens
-endTurn() discard all cards and tokens, set canDraw to true, replenish hand, restore hp if 0

Character
-name
-deck (starting cards)
-ability (later)

Deck
-player
-cards
-draw(n) draw n cards, call reshuffle if more cards are needed. Maybe call a separate draw function one at a time for simplicity? Then you can call it, but if there is no card to draw then it will reshuffle.
-draw() draw a single card. reshuffle if necessary.
-reshuffle() add discard to deck randomly
-addCard(card) add a newly acquired card

Hand
-player
-cards
-discard(card) move a card from the hand to the discard pile
-discardAll() discard all cards
-play(card)

Discard
-player
-cards

Card
-name
-type
-canPlay
-effect() what it does

Villains
-locations
-villainDeck
-darkArtsDeck
-hand this way we can easily check for things like morsmordre or we can check if any skulls were added
-discard
-currentLocation
-activeVillains
-playDarkArts()
-activateEffects()
-revealVillain()
-discardVillain()

Villain
-name
-hp
-ap (attack points)
-priority (what order they go in when multiple villains are out) later
-assignAP(player) I'm thinking you pass in a player and subtract one of their AP and add one to the villain.
-effect(player) pass in a player and perform the effect, for standing effects we can work them in on the villain turn or for certain effects we can have specific values or even a standingEffect list that gets checked forcertain actions. For now, keep it simple.
-defeat() A button activates when ap == hp and you can select it to get the reward

Locations
-name
-control
-addControl()
-removeControl()

Store
-deck
-hand we can treat the available cards as a 'hand' of sorts
-buyCard(player, card) take the selected card and add it to the player's deck. Don't activate the acquire button if the player doesn't have the money



old:
-effect(player) pass in a player and perform the effect, but what about standing effects? Maybe we check specifically for Draco or other villains when certain effects are triggered. Like if you have to add control check if Draco is active. If you have to discard a card check if Crabbe and Goyle are active.
It could be helpful to give the villains a 'turn' where they play their dark arts 'hand' as well as activate their abilities. Then it could be somewhat hard-coded to check for each villian.
