document.addEventListener('DOMContentLoaded',()=>{
  // -------------------------------------- VARIABLES --------------------------------------
  const fetchURL = 'https://pokeapi.co/api/v2/pokemon/'//URL for API
  const arrsPokeNames = []// array for holding all Pokemon names
  const nPokemonAvailable = 898//Number of Pokemon to get from API
  const ctx = canvas.getContext('2d')//2Dimensional roaming area for player/enemies
  let healthBar = document.getElementById('healthbar')
  // const eHealthBar = document.getElementById('eHealthBar')
  let battlePhase = false //false=>Roaming, true=>Battling
  let pikaTurn = true //true=>Player's turn in battle, false=>Enemy's turn
  // const playerAttackStat = 40
  // Is the following line even necessary?
  // const playerHealStat = document.getElementById('playerHealStat')
  // const enemyAttackStat = 2
  // const enemyHealStat = document.getElementById('enemyHealStat')
  let winNumber = 0//Counter to keep a high score for battles won
  let aIOn = document.getElementById('aIMode').checked//true=>battling against AI, false=> player selects enemy moves
  let renderWildOnes = document.getElementById('renderPokemon').checked
  // counter for how many enemies you hit in order to do them back to back
  // const nEncounters = 0//Not yet used

  // -------------------------------------- FUNCTIONS --------------------------------------
  
  // immediately fetch for array of Pokemon names
  function getPokeNames(){
    // URL for Poke API
    const fetchURL = '//pokeapi.co/api/v2/pokemon/?limit='+nPokemonAvailable
    fetch(fetchURL)
    .then(response => response.json())
    .then((jsonData) => {
      // Received data from API:
      // console.log('jsonData:\n',jsonData)
      for(let i=0; i<jsonData.results.length; i++){
        arrsPokeNames.push(jsonData.results[i].name)
      }
      // console.log(arrsPokeNames) //array filled
      // pick one at random for the first battle
      searchBox.value = arrsPokeNames[Math.floor(Math.random()*nPokemonAvailable)]
      // put them in the html datalist
      arrsPokeNames.forEach(function(item){
        var option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
      })
    })
  }
  getPokeNames()
  // console.log('arrsPokeNames: ',arrsPokeNames)//array filled
  
  // obj for appearing on canvas
  function Block(x, y, color, height, width){
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
    if(battlePhase){
      if(event.keyCode==38 || event.keyCode==40)
        event.preventDefault()
    } else {
      // switch (event.key.toLowerCase()) {
      switch (event.keyCode) {
        case 38: // UP key
          event.preventDefault()//prevent screen from scrolling from pressing arrows
          if(pikachu.y <= 10){
            pikachu.y = 0   //don't go past boundary
          } else {
            pikachu.y -= 10 //move up 10
          }
          break
        case 37: // LEFT key
          if(pikachu.x <= 10){
            pikachu.x = 0   //don't go past boundary
          } else {
            pikachu.x -= 10 //move left 10
          }
          break
        case 40: // DOWN key
          event.preventDefault()//prevent screen from scrolling from pressing arrows
          if(pikachu.y >= 130){
            pikachu.y = 140 //don't go past boundary
          } else {
            pikachu.y += 10 //move down 10
          }
          break
        case 39: // RIGHT key
          if(pikachu.x >= 280){
            pikachu.x = 290 //don't go past boundary
          } else {
            pikachu.x += 10 //move right 10
          }
          break
      }
    }
  }

  // detect player entering PokeCenter and heal
  function pokeCenterHandler(){
    if(!battlePhase){
      //If you make contact with the PokeCenter, heal, reset winCounter, reseed wild Pokemon
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
    if(!battlePhase){
      // clear the canvas
      ctx.clearRect(0,0, canvas.width, canvas.height)
      // display relevant game state (player movement) in our movement display
      pikaPosition.innerText = `Pikachu Position: x: ${pikachu.x}, y: ${pikachu.y}`
      
      //HERE IS WHERE WE WILL LOOK FOR WILD POKEMON ENCOUNTERS
      // zubats.forEach(zubat => detectEncounter(zubat))
      for(let i=0; i<zubats.length; i++){
        if(!battlePhase){
          detectEncounter(zubats[i],i)
        }
      }

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
      // render tall grass where Pokemon will hide
      tallGrass.render()
      // render 20 random Pokemon if checkbox checked
      renderWildOnes = document.getElementById('renderPokemon').checked
      if(renderWildOnes){
        zubats.forEach(zubat=>{
          zubat.render()
        })
      }
      // render Gary (the final boss)
      gary.render()
      // render our player
      pikachu.render()
    }
  }

  // Check the current position for presense of wild Pokemon
  function detectEncounter(zubat,i){
    if(
      pikachu.x + pikachu.width > zubat.x                &&
      pikachu.x                 < zubat.x + zubat.width  &&
      pikachu.y + pikachu.height> zubat.y                &&
      pikachu.y                 < zubat.y + zubat.height
    ){
      startBattle()
      console.log('---Battle started from detectEncounter---')
      zubats.splice(i,1)
    }
  }

  // Press B to automatically start battle
  function detectAutoBatle(event){
    if (!battlePhase && event.key.toLowerCase()==='b'){startBattle()}
  }

  // When battle starts, slide roamView offscreen to show battleView
  function viewChange() {
    main.classList.toggle('view-change');
  }
  btnChangeView.addEventListener('click',(e) => {
    e.preventDefault()
    viewChange()
  })

  // Stop rendering canvas in battleView
  function clearGameInterval(){clearInterval(gameInterval)}

  // Start battle
  function startBattle(){

    // const fetchURL = 'http://pokeapi.co/api/v2/pokemon/'//URL for API
    fetch(fetchURL+searchBox.value)
      .then(response => response.json())
      .then((jsonData) => {
        // Received data from API:
        console.log('Received data from API: jsonData:\n',jsonData)
        // Take img url from response obj
        const imgSrc = jsonData.sprites.front_default

        // Change image of enemy to be newly found Pokemon
        const enemyImg = document.getElementById('enemyImg')
        enemyImg.src = imgSrc

        // The whole fetch could probably be inside this if stmnt
        if(!battlePhase){viewChange()}
        battlePhase = true

        eHealthBar.value = 100
        turnDescription.innerText = searchBox.value+' appeared!'
        pikaTurn = true
        // Initialize CSS for battle start (Pikachu's turn)
        pOptions.classList.add('border')
        eOptions.classList.remove('border')
        pressEnter.style.display = 'none'
        ePressEnter.style.display = 'none'
        DHeal.classList.remove('selected')
        eDHeal.classList.remove('selected')
        AAttack.classList.remove('selected')
        eAAttack.classList.remove('selected')
      })
      .catch(console.error)
    
  }
  // End battle
  function endBattle(){
    viewChange()
    battlePhase = false
    winNumber++
    winCounter.innerText = winNumber
    // If Random is the selected radio, pick a new Pokemon at random
    if (choseRandom.checked){
      searchBox.value = arrsPokeNames[Math.floor(Math.random()*nPokemonAvailable)]
    }
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
        pressEnter.style.display = 'block'
        pressEnter.innerText = '(Press Enter to Attack)'
      } else if(event.key.toLowerCase()==='a' && !aIOn){
        eAAttack.classList.add('selected')
        eDHeal.classList.remove('selected')
        ePressEnter.innerText = '(Press Enter to Attack)'
      } else if(event.key.toLowerCase()==='d' && pikaTurn){
        DHeal.classList.add('selected')
        AAttack.classList.remove('selected')
        pressEnter.style.display = 'block'
        pressEnter.innerText = '(Press Enter to Heal)'
      } else if(event.key.toLowerCase()==='d' && !aIOn){
        eDHeal.classList.add('selected')
        eAAttack.classList.remove('selected')
        ePressEnter.innerText = '(Press Enter to Heal)'
      } else if(event.key==='Enter' &&
      // If they hit Enter and have a selection made...
      (((attackSelected || healSelected) && pikaTurn)
      || ((eAttackSelected || eHealSelected) && !pikaTurn))){
        switch(pikaTurn){
          case true:  // Player's turn
            if(attackSelected){// They have Attack selected and hit enter
              if(Math.random()<0.9){// Attacks have 90% accuracy
                if(Math.random()<0.1){// Attacks have 10% critical hit rate
                  turnDescription.innerText = "Critical Hit!!!"
                  console.log(turnDescription.innerText)
                  eHealthBar.value -= playerAttackStat.value*10
                } else {
                  turnDescription.innerText = "Pikachu's attack landed!"
                  eHealthBar.value -= playerAttackStat.value
                }
                if(eHealthBar.value<=0){
                  turnDescription.innerText = searchBox.value+" ran out of health..."
                  // battlePhase = false   DINO
                  setTimeout(endBattle,1500)
                } else {
                  turnIndicator.innerText = searchBox.value+"'s turn"
                }
              } else {
                turnDescription.innerText = "Pikachu's attack missed!!!"
                turnIndicator.innerText = searchBox.value+"'s turn"
              }
            } else if(healSelected){
              healthBar.value += parseInt(playerHealStat.value,10)
              turnDescription.innerText = "Pikachu healed!"
              turnIndicator.innerText = searchBox.value+"'s turn"
            }
            pressEnter.style.display = 'none'
            ePressEnter.style.display = 'block'
            // If player didn't win battle...
            if(eHealthBar.value>0){
              // get checkbox value for AI Mode
              aIOn = document.getElementById('aIMode').checked
              if(aIOn){setTimeout(startAITurn,1500)}
            }
            break
          case false:  // Enemy's turn
            if(eAttackSelected){// They have Attack selected and hit enter
              eAttack()
            } else if(eHealSelected){
              eHeal()
            }
            pressEnter.style.display = 'block'
            ePressEnter.style.display = 'none'
            break
        }
        pikaTurn = !pikaTurn
        if(pikaTurn){
          pOptions.classList.add('border')
          eOptions.classList.remove('border')
          pressEnter.style.display = 'block'
          ePressEnter.style.display = 'none'
        } else {
          pOptions.classList.remove('border')
          eOptions.classList.add('border')
          ePressEnter.style.display = 'block'
          pressEnter.style.display = 'none'
        }
      }
    }
  }
  // Make AI make a move
  function startAITurn(){
    if(Math.random()<0.7 || eHealthBar.value===eHealthBar.max){//AI will attack 70% of the time when health not full
      if(eAAttack.classList.contains('selected')){
        eAttack()
      } else {
        setTimeout(()=>{
          eAAttack.classList.add('selected')
          eDHeal.classList.remove('selected')
          eAttack()
        },500)
      }
    } else {//AI will heal 30% of the time
      if(eDHeal.classList.contains('selected')){
        eHeal()
      } else {
        setTimeout(()=>{
          eAAttack.classList.remove('selected')
          eDHeal.classList.add('selected')
          eHeal()
        },1500)
      }
    }
    pikaTurn = true
    pOptions.classList.add('border')
    eOptions.classList.remove('border')
    pressEnter.style.display = 'block'
  }
  function eAttack(){
    if(Math.random()<0.9){// Attacks have 90% accuracy
      if(Math.random()<0.1){// Attacks have 10% critical hit rate
        turnDescription.innerText = "Critical Hit!!!"
        console.log(turnDescription.innerText)
        healthBar.value -= enemyAttackStat.value*10
      } else {
        turnDescription.innerText = searchBox.value+"'s attack landed!"
        healthBar.value -= enemyAttackStat.value
      }
      if(healthBar.value<=0){
        turnDescription.innerText = "Pikachu ran out of health..."
        turnIndicator.innerText = "GAME OVER"
        battlePhase = false
      } else {
        turnIndicator.innerText = "Pikachu's turn"
      }
    } else {
      turnDescription.innerText = searchBox.value+"'s attack missed!!!"
      turnIndicator.innerText = "Pikachu's turn"
    }
  }
  function eHeal(){
    eHealthBar.value += parseInt(enemyHealStat.value,10)
    turnDescription.innerText = searchBox.value+" healed!"
    turnIndicator.innerText = "Pikachu's turn"
  }
  
  // -------------------------------------- CALLS --------------------------------------
  // Randomly dispersed wild pokemon
  const zubats = []
  for(let i=0; i<20; i++){
    let zubat = new Block(
      Math.floor(Math.random()*19)*10+50,//X
      Math.floor(Math.random()*12)*10+10,//Y
      'purple',10,10)
    zubats.push(zubat)
  }
  // Field of tall grass where pokemon might be lurking
  const tallGrass = new Block(50,10,'green',200,130)
  // character for walking around canvas. Only thing that moves
  const pikachu = new Block(10, 10, '#bada55', 10, 10)
  // PokeCenter for healing character (drawn with 3x3 'Bricks')
  const pC1r1c = new Block(10, 100, 'red', 3, 3)
  const pC1r2c = new Block(13, 100, 'red', 3, 3)
  const pC1r3c = new Block(16, 100, 'red', 3, 3)
  const pC1r4c = new Block(19, 100, 'red', 3, 3)
  const pC1r5c = new Block(22, 100, 'red', 3, 3)
  const pC2r1c = new Block(10, 103, 'red', 3, 3)
  const pC2r2c = new Block(13, 103, 'red', 3, 3)
  const pC2r3c = new Block(16, 103, 'white', 3, 3)
  const pC2r4c = new Block(19, 103, 'red', 3, 3)
  const pC2r5c = new Block(22, 103, 'red', 3, 3)
  const pC3r1c = new Block(10, 106, 'red', 3, 3)
  const pC3r2c = new Block(13, 106, 'white', 3, 3)
  const pC3r3c = new Block(16, 106, 'white', 3, 3)
  const pC3r4c = new Block(19, 106, 'white', 3, 3)
  const pC3r5c = new Block(22, 106, 'red', 3, 3)
  const pC4r1c = new Block(10, 109, 'red', 3, 3)
  const pC4r2c = new Block(13, 109, 'red', 3, 3)
  const pC4r3c = new Block(16, 109, 'white', 3, 3)
  const pC4r4c = new Block(19, 109, 'red', 3, 3)
  const pC4r5c = new Block(22, 109, 'red', 3, 3)
  const pC5r1c = new Block(10, 112, 'red', 3, 3)
  const pC5r2c = new Block(13, 112, 'red', 3, 3)
  const pC5r3c = new Block(16, 112, 'red', 3, 3)
  const pC5r4c = new Block(19, 112, 'red', 3, 3)
  const pC5r5c = new Block(22, 112, 'red', 3, 3)
  // character representing Gary (final boss)
  const gary = new Block(canvas.width-20,canvas.height/2-5,'brown',10,10)

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

  // Button for manually changing view (for development only)
  viewChangeBtn.addEventListener('click',viewChange)
})