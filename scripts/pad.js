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