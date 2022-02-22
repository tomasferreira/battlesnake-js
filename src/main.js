const log = require('./logger');
const Game = require('./Game');
const reporter = require('./reporter');
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
  log.info(`####################################### STARTING GAME ${gameState.game.id}`);
  log.debug(`My snake id is ${gameState.you.id}`);
  log.info('Snakes playing this game are:');
  try {
    gameState.board.snakes.forEach(({ name }) => {
      log.info(name);
      if (name != gameState.you.name) game.opponents.push(name);
    });
    if (game.opponents.length === 1 && game.gameType === 'standard')
      game.gameType = 'duel';
  }
  catch (e) { log.error(`ex in main.start.snakenames: ${e}`); }
}

function end(gameState) {
  let gameID = gameState.game.id;
  console.log(`${gameID} END\n`);

  let exceptions = log.writeLogs(gameState);
  reporter.prepareGameReport(gameState, games[gameID], exceptions);
  let reportObj = reporter.getReportObj(games[gameID]);
  
  console.log(games[gameID]);

  console.log(reportObj);
  reporter.saveReport(reportObj);

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
