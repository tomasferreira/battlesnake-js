const jsonfile = require('jsonfile');
const log = require('./logger');

function prepareReport(gameState, game) {
  let winnerName = false;
  let won = false;
  let turns = gameState.turn - 1;

  if (gameState.board.snakes.length !== 0) {
    const winningSnake = gameState.board.snakes[0];
    winnerName = gameState.board.snakes[0].name;
    if (winningSnake.id === gameState.you.id) {
      won = true;
    }
  }

  game.winnerName = winnerName;
  game.won = won;
  game.turns = turns;

  game.slowestMove = game.player.slowestMove;
  game.slowestTurn = game.player.slowestTurn;
}

function createEmptyReport() {
  let rep = {};

  rep.totalGames = 0;
  rep.totalGamesWon = 0;
  rep.totalGamesLost = 0;
  rep.totalWinPercent = 0;

  rep.arenaGames = 0;
  rep.nonArenaGames = 0;

  rep.slowestMove = 0;

  rep.standardGames = 0;
  rep.standardGamesWon = 0;
  rep.standardGamesLost = 0;
  rep.stadardGamesWinPercent = 0;

  rep.royaleGames = 0;
  rep.royaleGamesWon = 0;
  rep.royaleGamesLost = 0;
  rep.royaleGamesWinPercent = 0;

  rep.duelGames = 0;
  rep.duelGamesWon = 0;
  rep.duelGamesLost = 0;
  rep.duelGamesWinPercent = 0;

  return rep;
}

function report(game) {

  // eslint-disable-next-line no-undef
  const path = `${__dirname}/../report/report.json`;
  let rep;

  try {
    rep = jsonfile.readFileSync(path);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      log.status('Report file does not exist, creating new.');
      rep = createEmptyReport();
    } else if (err) log.error(`ex in reporter.report.readFile: ${err}`);
  }

  rep.totalGames++;
  if (game.won) rep.totalGamesWon++;
  else rep.totalGamesLost++;

  rep.totalWinPercent = Math.floor(rep.totalGamesWon / rep.totalGames * 100);

  if(game.slowestMove > rep.slowestMove) rep.slowestMove = game.slowestMove;

  if (game.gameType === 'standard') {
    rep.standardGames++;
    if (game.won) rep.standardGamesWon++;
    else rep.standardGamesLost++;
    rep.stadardGamesWinPercent = Math.floor(rep.standardGamesWon / rep.standardGames * 100);
  }

  if (game.gameType === 'royale') {
    rep.royaleGames++;
    if (game.won) rep.royaleGamesWon++;
    else rep.royaleGamesLost++;
    rep.royaleGamesWinPercent = Math.floor(rep.royaleGamesWon / rep.royaleGames * 100);
  }

  if (game.gameType === 'duel') {
    rep.duelGames++;
    if (game.won) rep.duelGamesWon++;
    else rep.duelGamesLost++;
    rep.duelGamesWinPercent = Math.floor(rep.duelGamesWon / rep.duelGames * 100);
  }

  if(game.source == 'arena') rep.arenaGames++;
  else rep.nonArenaGames++;

  // Next, find the people who defeated me the most
  // const winnersNames = gamesLost.map((game) => game.winnerName);
  // const rankedWinners = winnersNames.sort((a, b) => {
  //   winnersNames.filter(w => w === a).length - winnersNames.filter(w => w === b).length;
  // });

  // const highestWinner = rankedWinners[0];
  // const highestWinnerCount = rankedWinners.filter(w => w === highestWinner).length;
  // body += `\nYou lost the most to ${highestWinner} (${highestWinnerCount} times)`;
  // return body;
  return rep;
}

function saveReport(reportObj) {
  // eslint-disable-next-line no-undef
  const path = `${__dirname}/../report/report.json`;

  jsonfile.writeFile(path, reportObj, { spaces: 2 }, function (e) {
    if (e) log.error(`ex in reporter.saveReport: ${e}`);
  });
}

module.exports = {
  prepareReport,
  report,
  saveReport
};