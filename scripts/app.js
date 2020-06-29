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
