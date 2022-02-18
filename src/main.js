const p = require('./params');
const log = require('./logger');
const Game = require('./Game');
const { prepareReport, report, saveReport } = require('./reporter');
const games = {};

function info() {
  console.log('INFO');
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
  let reportObj = report(games[gameID]); 
  console.log(games[gameID]);

  // write logs for this game to file
  console.log(reportObj);
  saveReport(reportObj);
  log.writeLogs(gameState);
  
  delete games[gameID];
}

function move(gameState) {
  let gameID = gameState.game.id;
  // console.log(`${gameID} MOVE\n`);
  let move = games[gameID].player.move(gameState);

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
