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