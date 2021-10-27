document.addEventListener('DOMContentLoaded',()=>{
  // -------------------------------------- VARIABLES --------------------------------------
  const ctx = canvas.getContext('2d')
  let healthBar = document.getElementById('healthbar')
  const eHealthBar = document.getElementById('eHealthBar')
  let battlePhase = false //false=>Roaming, true=>Battling
  let pikaTurn = true //true=>Player's turn in battle, false=>Enemy's turn
  //let attackSelected = true //true=>battler has selected Attack, false=> has not selected Attack
  //let healSelected = false //false=>battler has selected Heal, true=> has not selected Heal
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
    if(!battlePhase){
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
  function viewChange(evt) {
    main.classList.toggle('view-change');
  }

  // Stop rendering canvas in battleView
  function clearGameInterval(){clearInterval(gameInterval)}

  // Start battle
  function startBattle(){
    battlePhase = true
    viewChange()
    eHealthBar.value = 100
    turnDescription.innerText = eName+' appeared!'
    pikaTurn = true
  }
  // End battle
  function endBattle(){
    battlePhase = false
    viewChange()
  }

  // Take turn in battle
  function takeTurn(event){
    if(battlePhase){
      const attackSelected = AAttack.classList.contains('selected')
      const healSelected = DHeal.classList.contains('selected')
      if(event.key==='a'){
        AAttack.classList.add('selected')
        DHeal.classList.remove('selected')
      }
      else if(event.key==='d'){
        DHeal.classList.add('selected')
        AAttack.classList.remove('selected')
      }
      else if(event.key==='Enter' && (attackSelected || healSelected)){
        switch(pikaTurn){
          case true:  // Player's turn
            if(attackSelected){// They have Attack selected and hit enter
              if(Math.random()<0.9){// Attacks have 90% accuracy
                turnDescription.innerText = "Pikachu's attack landed!"
                eHealthBar.value -= playerAttackStat
                if(eHealthBar.value<=0){
                  turnDescription.innerText = eName+" ran out of health..."
                  setTimeout(endBattle,1000)
                } else {
                  turnIndicator.innerText = eName+"'s turn"
                }
              } else {
                turnDescription.innerText = "Pikachu's attack missed!!!"
                turnIndicator.innerText = eName+"'s turn"
              }
            } else if(healSelected){
              healthBar.value += playerHealStat
              turnDescription.innerText = "Pikachu healed!"
              turnIndicator.innerText = eName+"'s turn"
            }
            break
          case false:  // Enemy's turn
          if(attackSelected){// They have Attack selected and hit enter
            if(Math.random()<0.9){// Attacks have 90% accuracy
              turnDescription.innerText = eName+"'s attack landed!"
              healthBar.value -= enemyAttackStat
              if(healthBar.value<=0){
                turnDescription.innerText = "Pikachu ran out of health..."
                turnIndicator.innerText = "GAME OVER"
              } else {
                turnIndicator.innerText = "Pikachu's turn"
              }
            } else {
              turnDescription.innerText = eName+"'s attack missed!!!"
              turnIndicator.innerText = "Pikachu's turn"
            }
          } else if(healSelected){
            eHealthBar.value += enemyHealStat
            turnDescription.innerText = eName+" healed!"
            turnIndicator.innerText = "Pikachu's turn"
          }
            break
        }
        pikaTurn = !pikaTurn
      }
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