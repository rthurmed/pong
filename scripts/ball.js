class Ball {
  static diameter = 42
  static speed = 10

  static initialX = innerWidth/2 - Ball.diameter/2
  static initialY = innerHeight/2 - Ball.diameter/2

  static randomDir = () => Math.round(Math.random()) || -1

  constructor () {
    this.reset()
  }

  // Diameter
  get d () { return Ball.diameter }

  // Radius
  get r () { return this.d / 2 }

  get ellipse () {
    return [
      this.x,
      this.y,
      this.d,
      this.d
    ]
  }

  get isGoingLeft () { return this.xdir < 0 }
  get isGoingRight () { return this.xdir > 0 }

  get isGoingUp () { return this.ydir < 0 }
  get isGoingDown () { return this.ydir > 0 }

  canBounce (pad) {
    return pad.y < (this.y + this.r) && pad.botY > (this.y - this.r)
  }

  reset () {
    this.x = Ball.initialX
    this.y = Ball.initialY
    this.xdir = Ball.randomDir()
    this.ydir = Ball.randomDir()
  }

  move (moveX, moveY) {
    const newX = this.x + moveX
    const newY = this.y + moveY

    const limitUp = MARGIN + this.r
    const limitDown = maxHeight - this.r

    const limitLeft = padl.faceX + this.r
    const limitRight = padr.faceX - this.r

    if (
      // Up
      newY > limitUp &&
      // Down
      newY < limitDown
    ) {
      this.y = newY
    } else {
      // Teleport the ball to the limit
      this.y = this.isGoingUp ? limitUp : limitDown
      this.ydir = this.ydir * -1
    }

    if (
      // Left
      newX > limitLeft &&
      // Right
      newX < limitRight
    ) {
      this.x = newX
    } else if (
      (this.isGoingLeft && this.canBounce(padl)) ||
      (this.isGoingRight && this.canBounce(padr))
    ) {
      // Teleport the ball to the limit
      this.x = this.isGoingLeft ? limitLeft : limitRight
      this.xdir = this.xdir * -1
    } else {
      this.reset()
      score.add(this.isGoingLeft ? PAD_RIGHT : PAD_LEFT)
    }
  }

  update () {
    this.move(
      this.xdir * Ball.speed,
      this.ydir * Ball.speed
    )
  }

  draw () {
    ellipse(...this.ellipse)
  }
}