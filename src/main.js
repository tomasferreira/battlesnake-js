const p = require('./params');
const log = require('./logger');
const Game = require('./Game');
const { prepareReport, report } = require('./utils');
const games = {};

let slowest = 0;
let slowestMove = 0;

function info() {
  if (Object.entries(games).length > 0) {
    console.log(report(Object.values(games)));
  } else {
    console.log('INFO');
  }
  const response = {
    apiversion: '1',
    author: 'tomasvcferreira',
    color: '#FF0000',
    head: 'default',
    tail: 'default'
  };
  return response;
}

function start(gameState) {
  let gameID = gameState.game.id;
  console.log(`${gameID} START`);
  var game = new Game(gameState);
  games[gameID] = game;

  // ensure previous game logs are cleared
  log.initGameLogs();
  if (p.STATUS) {
    log.status(`####################################### STARTING GAME ${gameState.game.id}`);
    log.status(`My snake id is ${gameState.you.id}`);
    slowest = 0;
    slowestMove = 0;
    log.status('Snakes playing this game are:');
    try {
      gameState.board.snakes.forEach(({ name }) => {
        log.status(name);
      });
    }
    catch (e) { log.error(`ex in main.start.snakenames: ${e}`); }
  }

}

function end(gameState) {
  let gameID = gameState.game.id;
  console.log(`${gameID} END\n`);
  prepareReport(gameState, games[gameID]);
  console.log(games[gameID]);

  log.status(`\nSlowest move ${slowestMove} took ${slowest}ms.`);
  // write logs for this game to file
  log.writeLogs(gameState);
  console.log(report(Object.values(games)));
}

function move(gameState) {
  let gameID = gameState.game.id;
  // console.log(`${gameID} MOVE\n`);
  let move = games[gameID].player.move(gameState, slowest, slowestMove);

  games[gameID].turn++;
  // console.log(move, games[gameID].turn);
  return move;
}

module.exports = {
  info: info,
  start: start,
  move: move,
  end: end
};
