const MARGIN = 10
const FRAMERATE = 60
const TEXTSIZE = 20

const PAD_RIGHT = 'right'
const PAD_LEFT = 'left'

// screen
const { innerWidth, innerHeight } = window

const maxHeight = innerHeight - MARGIN
const maxWidth = innerWidth - MARGIN

// keys
const KEY_W = 87 // w
const KEY_S = 83 // s

const KEY_UP = 38 // ArrowUp
const KEY_DOWN = 40 // ArrowDown

const KEY_ESC = 'Escape'

// colors
const color = {
  bg: [0,0,0],
  fg: [255,255,255]
}

class Pad {
  static height = 180
  static width = 30
  static speed = 10

  constructor (x, y) {
    this.x = x,
    this.y = y
  }

  get h () { return Pad.height }
  get w () { return Pad.width }
  get botY () { return this.y + this.h }

  get rect () {
    return [
      this.x,
      this.y,
      this.w,
      this.h
    ]
  }

  get face () {
    return {
      top: [ this.faceX, this.y ],
      bot: [ this.faceX, this.botY ]
    }
  }

  move (move) {
    if (
      this.y + move > MARGIN &&
      this.botY + move < maxHeight
    ) {
      this.y += move
    }
  }

  moveUp () { this.move(Pad.speed * -1) }
  moveDown () { this.move(Pad.speed) }

  update () {
    if (keyIsDown(this.keyMoveDown)) { this.moveDown() }
    if (keyIsDown(this.keyMoveUp)) { this.moveUp() }
  }

  draw () {
    rect(...this.rect)
  }
}

class PadLeft extends Pad {
  constructor(x = MARGIN, y = innerHeight / 2 - Pad.height / 2) {
    super(x, y)
  }

  get keyMoveUp () { return KEY_W }
  get keyMoveDown () { return KEY_S }

  get faceX () { return this.x + this.w }
}

class PadRight extends Pad {
  constructor(x = innerWidth - Pad.width - MARGIN, y = innerHeight / 2 - Pad.height / 2) {
    super(x, y)
  }

  get keyMoveUp () { return KEY_UP }
  get keyMoveDown () { return KEY_DOWN }

  get faceX () { return this.x }
}

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

class ScoreCount {
  constructor () {
    this.score = {
      [PAD_RIGHT]: 0,
      [PAD_LEFT]: 0
    }
  }

  add(side) {
    this.score[side]++
  }

  draw () {
    textAlign(CENTER, CENTER)
    text(`${this.score[PAD_LEFT]} | ${this.score[PAD_RIGHT]}`, innerWidth/2, MARGIN * 2)
  }
}

let canvas

let padr = new PadRight()
let padl = new PadLeft()
let ball = new Ball()
let score = new ScoreCount()

let paused = false

function setup () {
  canvas = createCanvas(innerWidth, innerHeight)

  frameRate(FRAMERATE)

  textSize(TEXTSIZE)
  strokeWeight(1)
}

function draw () {
  // update
  if (!paused) {
    ball.update()
    padr.update()
    padl.update()
  }

  // reset screen
  clear()
  background(...color.bg)

  // draw
  fill(...color.fg)

  padr.draw()
  padl.draw()
  ball.draw()

  score.draw()

  if (paused) {
    textAlign(CENTER, CENTER)
    text('Press esc to continue', innerWidth/2, innerHeight/2)
  }
}

function keyPressed () {
  if (key == KEY_ESC) {
    paused = !paused
  }
}
