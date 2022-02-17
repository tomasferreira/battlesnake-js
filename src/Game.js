const Player = require('./Player');

class Game {
  constructor(gameState) {
    this.id = gameState.game.id;
    this.player = new Player();
    this.turn = 0;
    this.report;
    this.opponents = [];
    this.gameType = gameState.game.ruleset.name;

    gameState.board.snakes.forEach(snake => {
      if (snake.id != gameState.you.id) {
        this.opponents.push(snake.name);
      }
    });
    if(this.opponents.length === 1) {
      this.gameType = 'duel';
    }
  }
}

module.exports = Game;