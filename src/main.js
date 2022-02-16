const Game = require('./Game');
const { prepareReport, report } = require('./utils');
const games = {};

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
}

function end(gameState) {
  let gameID = gameState.game.id;
  console.log(`${gameID} END\n`);
  prepareReport(gameState, games[gameID]);
  console.log(games[gameID]);
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
