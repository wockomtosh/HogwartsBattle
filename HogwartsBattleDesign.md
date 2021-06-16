Hogwarts Battle Online Game Docs

https://github.com/wockomtosh/HogwartsBattle

What are the essential elements of the game?
I'm going to start by only implementing year 1.
I'm going to start by only implementing 1 player.


Flow: Once you log in you will see a display. This display lets you start a game. Once a game is started you will see a game display that will allow you to play the game. If a game aleady exists you can continue it.
In GameView you need to be able to start a new game and continue an old game.
In the actual Game you should pass all the info from GameView so that you can start the game without issues.

Card effects:
An array of numbers representing what the card does. This is for both dark arts cards as well as for player cards, and probably even villain and hero abilities.
0: add coin
1: add ap
2: add hp
3: draw
4: remove control
5: add control
6: remove hp
7: discard


The user has a Character, Deck, Hand, and Villains

Character - store everything else about the game state here?
-name
-deck (list of starting cards)
-hand
-hp
-ap (attack points)
-coins
-ability (later)
-canDraw (for basilisk and petrification will just set canDraw to false at the beginning of the turn)
-stunned() this will add a skull, make the player discard half their cards, and discard their tokens
-endTurn() discard all cards and tokens, set canDraw to true, replenish hand, restore hp if 0

Deck
-player
-cards
-discard
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

Card
-name
-type
-canPlay
-cost
-effect What the card does, stored as a list of numbers corresponding to functions that can be called after the card is retrieved. How do I store things like "for each ally _"? What about the invisibility cloak? For cards with options you can store multiple lists and have the player select an option. Strip out some functionality for now.
-discardEffect Same as above but to be activated if the card is discarded. Most cards will have an empty list.

Villains
-locations can be stored as a tuple or list of 2 objects, the name and how much control is needed to lose the location.
-villainDeck
-darkArtsDeck
-hand this way we can easily check for things like morsmordre or we can check if any skulls were added
-discard
-currentLocation
-control
-activeVillains
-playDarkArts()
-activateEffects()
-revealVillain()
-discardVillain()
-addControl()
-removeControl()

Villain
-name
-hp
-ap (attack points)
-priority (what order they go in when multiple villains are out) later
-assignAP(player) I'm thinking you pass in a player and subtract one of their AP and add one to the villain.
-effect(player) pass in a player and perform the effect, for standing effects we can work them in on the villain turn or for certain effects we can have specific values or even a standingEffect list that gets checked forcertain actions. For now, keep it simple.
-defeat() A button activates when ap == hp and you can select it to get the reward

Store
-deck
-hand we can treat the available cards as a 'hand' of sorts
-buyCard(player, card) take the selected card and add it to the player's deck. Don't activate the acquire button if the player doesn't have the money



old:
-effect(player) pass in a player and perform the effect, but what about standing effects? Maybe we check specifically for Draco or other villains when certain effects are triggered. Like if you have to add control check if Draco is active. If you have to discard a card check if Crabbe and Goyle are active.
It could be helpful to give the villains a 'turn' where they play their dark arts 'hand' as well as activate their abilities. Then it could be somewhat hard-coded to check for each villian.
