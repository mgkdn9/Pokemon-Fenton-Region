const ctx = canvas.getContext('2d')

let pikachu = new Crawler(10, 10, '#bada55', 16, 16)
console.log(pikachu)

// add event listener for player movement
document.addEventListener('keydown',movementHandler)

// Check the current position for presense of wild Pokemon
function detectEncounter(){
  if(false){startBattle()}//just a mental placeholder
}

// what happens when game is running
function roamLoop(){
  // clear the canvas
  ctx.clearRect(0,0, canvas.width, canvas.height)
  // display relevant game state (player movement) in our movement display
  pikaPosition.innerText = `x: ${pikachu.x}\ny: ${pikachu.y}`
  
  //HERE IS WHERE WE WILL LOOK FOR WILD POKEMON ENCOUNTERS
  //OR PRESSING OF B KEY TO START
  detectEncounter()

  // render our player
  pikachu.render()
}


// Run ftn roamLoop inside setInterval to update playerMovementArea during Roaming
const gameInterval = setInterval(roamLoop, 70)
function clearGameInterval(){clearInterval(gameInterval)}

// Initially Pressing 'B' will start battle
document.addEventListener('keydown',detectAutoBatle)
function detectAutoBatle(event){
  if (event.key.toLowerCase()==='b'){startBattle()}
}

// When battle starts, slide roamView offscreen
function onViewChange(evt) {
  main.classList.toggle('view-change');
}
leftBtn.addEventListener('click', onViewChange)
rightBtn.addEventListener('click', onViewChange, false)