const Player = require('./Player');

class Game {
  constructor(gameID) {
    this.id = gameID;
    this.player = new Player();
    this.turn = 0;
    this.report;
  }
}

module.exports = Game;