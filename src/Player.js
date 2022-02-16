const keys = require('./keys');
const g = require('./grid');
const m = require('./move');
const p = require('./params');
const s = require('./self');
const log = require('./logger');
const search = require('./search');

class Player {
  move(data, slowest, slowestMove) {

    let startTime;
    if (p.STATUS) {
      let date = new Date();
      startTime = date.getMilliseconds();
    }

    const health = data.you.health;
    const turn = data.turn;

    if (p.STATUS) log.status(`\n\n####################################### MOVE ${data.turn}`);

    let grid = [];
    try {
      grid = g.buildGrid(data);
      grid = search.preprocessGrid(grid, data);
    }
    catch (e) { log.error(`ex in main.buildGrid: ${e}`, turn); }

    let move = null;
    if (p.DEBUG) log.status(`biggest snake ? ${s.biggestSnake(data)}`);

    const minHealth = p.SURVIVAL_MIN - Math.floor(data.turn / p.LONG_GAME_ENDURANCE);
    // if you are hungry or small you gotta eat
    if (health < minHealth || turn < p.INITIAL_FEEDING) {
      try { move = m.eat(grid, data); }
      catch (e) { log.error(`ex in main.survivalMin: ${e}`, turn); }
    }
    // start early game by killing some time, to let dumb snakes die
    else if (turn < p.INITIAL_TIME_KILL) {
      try { move = m.killTime(grid, data); }
      catch (e) { log.error(`ex in main.initialKillTime: ${e}`, turn); }
    }
    else if (!s.biggestSnake(data)) {
      try { move = m.eat(grid, data); }
      catch (e) { log.error(`ex in main.notBiggest: ${e}`, turn); }
    }
    // if you are the biggest you can go on the hunt
    else if (s.biggestSnake(data)) {
      try { move = m.hunt(grid, data); }
      catch (e) { log.error(`ex in main.biggest: ${e}`, turn); }
    }
    // backup plan?
    if (move === null) {
      try { move = m.eat(grid, data); }
      catch (e) { log.error(`ex in main.backupPlan: ${e}`, turn); }
    }

    if (p.STATUS) {
      let date2 = new Date();
      let endTime = date2.getMilliseconds();
      if (endTime - startTime > slowest) {
        slowest = endTime - startTime;
        slowestMove = data.turn;
      }
      log.status(`Move ${data.turn} took ${endTime - startTime}ms.`);
    }
    return {
      move: move ? keys.DIRECTION[move] : keys.DIRECTION[keys.UP]
    };

  }
}

module.exports = Player;