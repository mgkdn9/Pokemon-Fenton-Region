document.addEventListener('DOMContentLoaded',()=>{
  // -------------------------------------- VARIABLES --------------------------------------
  const ctx = canvas.getContext('2d')
  let healthBar = document.getElementById('healthbar')
  const eHealthBar = document.getElementById('eHealthBar')
  let battlePhase = false //false=>Roaming, true=>Battling
  let pikaTurn = true //true=>Player's turn in battle, false=>Enemy's turn
  const playerAttackStat = 40
  const playerHealStat = 60
  const enemyAttackStat = 2
  const enemyHealStat = 3
  const eName = 'Lugia'
  let winNumber = 0

  // -------------------------------------- FUNCTIONS --------------------------------------
  // obj capable of moving around canvas
  function Crawler(x, y, color, height, width){
    this.x = x
    this.y = y
    this.color = color
    this.height = height
    this.width = width
    // this.background = 'battlePikachu.png'
    this.backgroundImage = ('battlePikachu.png');
    // then to define our 'render' method
    this.render = function() {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.height, this.width)
    }
  }

  // obj fixed to one location in canvas
  function Brick(x, y, color, height, width){
    this.x = x
    this.y = y
    this.color = color
    this.height = height
    this.width = width
    // render ftn shows on screen
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

  // detect player entering PokeCenter and heal
  function pokeCenterHandler(event){
    if(!battlePhase){
      if(
        pikachu.x                 <= pC1r1c.x + pC1r1c.width*5  &&
        pikachu.x + pikachu.width >= pC1r1c.x                   &&
        pikachu.y                 <= pC1r1c.y + pC1r1c.height*5 &&
        pikachu.y + pikachu.height>= pC1r1c.y
      ){
        healthBar.value = healthBar.max//Reset player health
        winNumber = 0//Reset Win Total on screen
        winCounter.innerText = winNumber
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
    // render the PokeCenter (all 25 individual Bricks...)
    pC1r1c.render()
    pC1r2c.render()
    pC1r3c.render()
    pC1r4c.render()
    pC1r5c.render()
    pC2r1c.render()
    pC2r2c.render()
    pC2r3c.render()
    pC2r4c.render()
    pC2r5c.render()
    pC3r1c.render()
    pC3r2c.render()
    pC3r3c.render()
    pC3r4c.render()
    pC3r5c.render()
    pC4r1c.render()
    pC4r2c.render()
    pC4r3c.render()
    pC4r4c.render()
    pC4r5c.render()
    pC5r1c.render()
    pC5r2c.render()
    pC5r3c.render()
    pC5r4c.render()
    pC5r5c.render()
    // render Gary (the final boss)
    gary.render()
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
  function viewChange() {
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
    pOptions.classList.add('border')
    eOptions.classList.remove('border')
  }
  // End battle
  function endBattle(){
    battlePhase = false
    winNumber++
    winCounter.innerText = winNumber
    viewChange()
  }

  // Take turn in battle
  function takeTurn(event){
    if(battlePhase){
      const attackSelected  = AAttack.classList.contains('selected')
      const healSelected    = DHeal.classList.contains('selected')
      const eAttackSelected = eAAttack.classList.contains('selected')
      const eHealSelected   = eDHeal.classList.contains('selected')
      if(event.key.toLowerCase()==='a' && pikaTurn){
        AAttack.classList.add('selected')
        DHeal.classList.remove('selected')
        pressEnter.innerText = '(Press Enter to Attack)'
      } else if(event.key.toLowerCase()==='a'){
        eAAttack.classList.add('selected')
        eDHeal.classList.remove('selected')
        ePressEnter.innerText = '(Press Enter to Attack)'
      } else if(event.key.toLowerCase()==='d' && pikaTurn){
        DHeal.classList.add('selected')
        AAttack.classList.remove('selected')
        pressEnter.innerText = '(Press Enter to Heal)'
      } else if(event.key.toLowerCase()==='d'){
        eDHeal.classList.add('selected')
        eAAttack.classList.remove('selected')
        ePressEnter.innerText = '(Press Enter to Heal)'
      }
      else if(event.key==='Enter' &&
      // It wasn't this messy before Thursday....
      (((attackSelected || healSelected) && pikaTurn)
      || ((eAttackSelected || eHealSelected) && !pikaTurn))){
        switch(pikaTurn){
          case true:  // Player's turn
            if(attackSelected){// They have Attack selected and hit enter
              if(Math.random()<0.9){// Attacks have 90% accuracy
                if(Math.random()<0.1){// Attacks have 10% critical hit rate
                  turnDescription.innerText = "Critical Hit!!!"
                  eHealthBar.value -= playerAttackStat*10
                } else {
                  turnDescription.innerText = "Pikachu's attack landed!"
                  eHealthBar.value -= playerAttackStat
                }
                if(eHealthBar.value<=0){
                  turnDescription.innerText = eName+" ran out of health..."
                  setTimeout(endBattle,1500)
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
            pressEnter.style.display = 'none'
            ePressEnter.style.display = 'block'
            break
          case false:  // Enemy's turn
            if(eAttackSelected){// They have Attack selected and hit enter
              if(Math.random()<0.9){// Attacks have 90% accuracy
                if(Math.random()<0.1){// Attacks have 10% critical hit rate
                  turnDescription.innerText = "Critical Hit!!!"
                  healthBar.value -= enemyAttackStat*10
                } else {
                  turnDescription.innerText = eName+"'s attack landed!"
                  healthBar.value -= enemyAttackStat
                }
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
            } else if(eHealSelected){
              eHealthBar.value += enemyHealStat
              turnDescription.innerText = eName+" healed!"
              turnIndicator.innerText = "Pikachu's turn"
            }
            pressEnter.style.display = 'block'
            ePressEnter.style.display = 'none'
            break
        }
        pikaTurn = !pikaTurn
        if(pikaTurn){
          pOptions.classList.add('border')
          eOptions.classList.remove('border')
        } else {
          pOptions.classList.remove('border')
          eOptions.classList.add('border')
        }
      }
    }
  }

  
  // -------------------------------------- CALLS --------------------------------------
  // character for walking around canvas
  let pikachu = new Crawler(10, 10, '#bada55', 10, 10)
  // PokeCenter for healing character (drawn with 3x3 'Bricks')
  const pC1r1c = new Brick(10, 100, 'red', 3, 3)
  const pC1r2c = new Brick(13, 100, 'red', 3, 3)
  const pC1r3c = new Brick(16, 100, 'red', 3, 3)
  const pC1r4c = new Brick(19, 100, 'red', 3, 3)
  const pC1r5c = new Brick(22, 100, 'red', 3, 3)
  const pC2r1c = new Brick(10, 103, 'red', 3, 3)
  const pC2r2c = new Brick(13, 103, 'red', 3, 3)
  const pC2r3c = new Brick(16, 103, 'white', 3, 3)
  const pC2r4c = new Brick(19, 103, 'red', 3, 3)
  const pC2r5c = new Brick(22, 103, 'red', 3, 3)
  const pC3r1c = new Brick(10, 106, 'red', 3, 3)
  const pC3r2c = new Brick(13, 106, 'white', 3, 3)
  const pC3r3c = new Brick(16, 106, 'white', 3, 3)
  const pC3r4c = new Brick(19, 106, 'white', 3, 3)
  const pC3r5c = new Brick(22, 106, 'red', 3, 3)
  const pC4r1c = new Brick(10, 109, 'red', 3, 3)
  const pC4r2c = new Brick(13, 109, 'red', 3, 3)
  const pC4r3c = new Brick(16, 109, 'white', 3, 3)
  const pC4r4c = new Brick(19, 109, 'red', 3, 3)
  const pC4r5c = new Brick(22, 109, 'red', 3, 3)
  const pC5r1c = new Brick(10, 112, 'red', 3, 3)
  const pC5r2c = new Brick(13, 112, 'red', 3, 3)
  const pC5r3c = new Brick(16, 112, 'red', 3, 3)
  const pC5r4c = new Brick(19, 112, 'red', 3, 3)
  const pC5r5c = new Brick(22, 112, 'red', 3, 3)
  // character representing Gary (final boss)
  const gary = new Crawler(canvas.width-20,canvas.height/2,'brown',10,10)

  // add event listener for player movement
  document.addEventListener('keydown',movementHandler)

  // PokeCenter hit detection
  document.addEventListener('keydown',pokeCenterHandler)

  // Run ftn roamLoop inside setInterval to update playerMovementArea during Roaming
  const gameInterval = setInterval(roamLoop, 100)

  // Initially Pressing 'B' will start battle
  document.addEventListener('keydown',detectAutoBatle)

  // State machine for battling
  document.addEventListener('keydown',takeTurn)
})