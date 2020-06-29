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