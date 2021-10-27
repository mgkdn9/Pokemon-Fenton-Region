document.addEventListener('DOMContentLoaded',()=>{
  // -------------------------------------- VARIABLES --------------------------------------
  const ctx = canvas.getContext('2d')
  const healthBar = document.getElementById('healthbar')
  const eHealthBar = document.getElementById('eHealthBar')
  let battlePhase = false //false=>Roaming, true=>Battling
  let pikaTurn = true //true=>Player's turn in battle, false=>Enemy's turn
  let attackSelected = true //true=>battler has selected Attack, false=> has not selected Attack
  let healSelected = false //false=>battler has selected Heal, true=> has not selected Heal
  const playerAttackStat = 4
  const playerHealStat = 6
  const enemyAttackStat = 2
  const enemyHealStat = 3
  const eName = 'Lugia'

  // -------------------------------------- FUNCTIONS --------------------------------------
  // obj capable of moving around canvas
  function Crawler(x, y, color, height, width){
    this.x = x
    this.y = y
    this.color = color
    this.height = height
    this.width = width
    this.alive = true
    // then to define our 'render' method
    this.render = function() {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.height, this.width)
    }
  }

  // move player around PlayerMovementArea
  function movementHandler(event){
    switch (event.key.toLowerCase()) {
      case'w': // W key
        pikachu.y -= 10//move up 10
        break
      case'a': // A key
        pikachu.x -= 10//move left 10
        break
      case's': // S key
        pikachu.y += 10//move down 10
        break
      case'd': // D key
        pikachu.x += 10//move right 10
        break
    }
  }

  // Loop running during roamView
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

  // Check the current position for presense of wild Pokemon
  function detectEncounter(){
    if(false){startBattle()}//just a mental placeholder
  }

  // Press B to automatically start battle
  function detectAutoBatle(event){
    if (!battlePhase && event.key.toLowerCase()==='b'){startBattle()}
  }

  // When battle starts, slide roamView offscreen to show battleView
  function onViewChange(evt) {
    main.classList.toggle('view-change');
  }

  // Stop rendering canvas in battleView
  function clearGameInterval(){clearInterval(gameInterval)}

  // Start battle
  function startBattle(){
    battlePhase = true
    onViewChange()
    // eHealthBar.value = 100
  }

  // Take turn in battle
  function takeTurn(event){
    if(battlePhase && event.key==='Enter'){
      switch(pikaTurn){
        case true:  // Player's turn
          if(attackSelected){// They have Attack selected and hit enter
            if(Math.random()<0.9){// Attacks have 90% accuracy
              eHealthBar.value -= playerAttackStat
              turnDescription.innerText = "Pikachu's attack landed!"
            } else {
              turnDescription.innerText = "Pikachu's attack missed!!!"
            }
          } else if(healSelected){
            healthBar += playerHealStat
          }
          if(eHealthBar.value<=0){
            turnDescription.innerText = "Pikachu ran out of health..."
          } else {
            turnIndicator.innerText = eName+"'s Turn"
          }
          break
        case false:  // Enemy's turn
          if(attackSelected){
            healthBar.value -= enemyAttackStat
          } else if(healSelected){
            eHealthBar += enemyHealStat
          }
          turnIndicator.innerText = "Pikachu's Turn"
          break
      }
      pikaTurn = !pikaTurn
    }
  }

  
  // -------------------------------------- CALLS --------------------------------------
  // character for walking around canvas
  let pikachu = new Crawler(10, 10, '#bada55', 16, 16)
  // healthbar.value = 10

  // add event listener for player movement
  document.addEventListener('keydown',movementHandler)

  // Run ftn roamLoop inside setInterval to update playerMovementArea during Roaming
  const gameInterval = setInterval(roamLoop, 70)

  // Initially Pressing 'B' will start battle
  document.addEventListener('keydown',detectAutoBatle)

  // State machine for battling
  document.addEventListener('keydown',takeTurn)

  // leftBtn.addEventListener('click', onViewChange)
  // rightBtn.addEventListener('click', onViewChange, false)
})