const Player = require('./Player');

class Game {
  constructor(gameState) {
    this.id = gameState.game.id;
    this.player = new Player();
    this.turn = 0;
    this.opponents = [];
    this.gameType = gameState.game.ruleset.name;
    this.slowestTurn = 0;
    this.slowestMove = 0;
    this.source = gameState.game.source;
    this.exceptions = 0;
    this.winnerName = '';
    this.tie = false;
  }
}

module.exports = Game;