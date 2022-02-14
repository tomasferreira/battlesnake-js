const Game = require('./Game');
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
  var game = new Game(gameID);
  games[gameID] = game;
}

function end(gameState) {
  let gameID = gameState.game.id;
  console.log(`${gameID} END\n`);
  delete games[gameID];
}

function move(gameState) {
  let gameID = gameState.game.id;
  console.log('turn: ' + ++games[gameID].turn);
  let move = games[gameID].player.move(gameState);
  console.log(move);
  return move;
}

module.exports = {
  info: info,
  start: start,
  move: move,
  end: end
};
