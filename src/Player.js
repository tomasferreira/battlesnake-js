const gridUtils = require('./gridUtils');
const moveUtils = require('./moveUtils');
const selfUtils = require('./selfUtils');
const searchUtils = require('./searchUtils');
const params = require('./params');
const keys = require('./keys');
const log = require('./logger');

class Player {
  constructor() {
    this.slowestTurn = 0;
    this.slowestMove = 0;
    this.moves = [];
  }

  move(data) {

    let startTime;
    if (params.TIMING) {
      let date = new Date();
      startTime = date.getMilliseconds();
    }

    const health = data.you.health;
    const turn = data.turn;

    log.info(`\n\n####################################### MOVE ${data.turn} - ${data.game.id}`);

    let grid = [];
    try {
      grid = gridUtils.buildGrid(data);
      grid = searchUtils.preprocessGrid(grid, data);
    }
    catch (e) { log.error(`ex in main.buildGrid: ${e}`, turn); }

    let move = null;
    log.info(`biggest snake ? ${selfUtils.biggestSnake(data)}`);

    const minHealth = params.SURVIVAL_MIN - Math.floor(data.turn / params.LONG_GAME_ENDURANCE);

    // if you are hungry or small you gotta eat
    if (health < minHealth || turn < params.INITIAL_FEEDING) {
      try { move = moveUtils.eat(grid, data); }
      catch (e) { log.error(`ex in main.survivalMin: ${e}`, turn); }
    }

    // start early game by killing some time, to let dumb snakes die
    else if (turn < params.INITIAL_TIME_KILL) {
      try { move = moveUtils.killTime(grid, data); }
      catch (e) { log.error(`ex in main.initialKillTime: ${e}`, turn); }
    }

    else if (!selfUtils.biggestSnake(data)) {
      try { move = moveUtils.eat(grid, data); }
      catch (e) { log.error(`ex in main.notBiggest: ${e}`, turn); }
    }

    // if you are the biggest you can go on the hunt
    else if (selfUtils.biggestSnake(data)) {
      try { move = moveUtils.hunt(grid, data); }
      catch (e) { log.error(`ex in main.biggest: ${e}`, turn); }
    }

    // backup plan?
    if (move === null) {
      try { move = moveUtils.eat(grid, data); }
      catch (e) { log.error(`ex in main.backupPlan: ${e}`, turn); }
    }

    if (params.TIMING) {
      let date2 = new Date();
      let endTime = date2.getMilliseconds();
      if (endTime - startTime > this.slowestMove) {
        this.slowestMove = endTime - startTime;
        this.slowestTurn = data.turn;
      }
      log.info(`Move ${data.turn} took ${endTime - startTime}ms.`);
    }

    // this.moves.push({
    //   move: move ? keys.DIRECTION[move] : 'NO MOVE'
    // });
    return {
      move: move ? keys.DIRECTION[move] : keys.DIRECTION[keys.UP]
    };

  }
}

module.exports = Player;