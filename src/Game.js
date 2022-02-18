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


    gameState.board.snakes.forEach(snake => {
      if (snake.id != gameState.you.id) {
        this.opponents.push(snake.name);
      }
    });
    if(this.opponents.length === 1 && this.gameType === 'standard') {
      this.gameType = 'duel';
    }
  }
}

module.exports = Game;