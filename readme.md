# Pokemon Fenton Region

This will be a open world game similar to Pokemon.

Live Link: [PokeClone Fenton Region](https://mgkdn9.github.io/Pokemon-Fenton-Region/)

### Tech stack (Javascript, CSS, HTML)

![Slide 1](Pokemon-Wireframe.png)

## MVP Goals
### Single pikachu wandering around on Player Movement Area (as opposed to a player with a selection of battle-doers)
### Pikachu can battle against Pokemon object which is instigated by simply pressing "B" key
### Pikachu / Pokemon object have health and can either Attack or Heal in their turn
### When someone runs out of health, battle ends and another can commence (return to initial state)
### Track max number of battles won before fainting

## Stretch Goals
### Sprite for moving pikachu
### Pikachu levels up due to xp earned in battle
### Grass, Water, Fire, Electric, Normal types of pokemon
### Grid of 'tall grass' which shows grid of grassy squares
### Poke-Center to heal Pikachu
### Gym Leader (obvi named Gary) at the end has 3 different pokemon which must be beaten without healing inbetween
### Create trainer who holds multiple Pokemon

## Potential roadblocks
### Saving place in game to a file would be handy/neat


## How it works
### There is a roaming phase and a battling phase
### Roaming is outside of battle when Player is walking around looking for things 
### Battling is when player encounters wild Pokemon (or enemy trainer) and must fight to continue




## To Dos
### Fix issue with running into multiple foes. Make foes spawn only every 10 spaces. This will effectively set up a grid structure. Doesn't allow running into multiple foes unless they would occupy the same exact square.
### Screen record for LinkedIn
### Bug with getting stuck in roaming despite running into foes. Does API call each time but doesn't switch screens and doesn't change controls to battle controls. Just playing normally gets you into that state.

### Make so can set start and end points of PokeSearch so you could only be in field of gen 2 pokemon for instance.
### Make health go down slowly ("S-shaped") with vanishing red rectangle
### Figure out why have to make Change View btn hidden and can't just be deleted when needed
### Make modes where enemies move / chase after you
### Make Gary encounter always startBattle()

### Changed 'Render...' to unchecked and playerAttackStat back to 40