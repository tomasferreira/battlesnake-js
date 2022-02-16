const Player = require('./Player');

class Game {
  constructor(gameState) {
    this.id = gameState.game.id;
    this.player = new Player();
    this.turn = 0;
    this.report;
    this.opponents = [];

    gameState.board.snakes.forEach(snake => {
      if (snake.id != gameState.you.id) {
        this.opponents.push(snake.name);
      }
    });
  }
}

module.exports = Game;