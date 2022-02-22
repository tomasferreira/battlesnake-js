const jsonfile = require('jsonfile');
const log = require('./logger');

function prepareGameReport(gameState, game, exceptions) {
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
  game.exceptions = exceptions;
  if (gameState.board.snakes.length === 0) game.tie = true;
  else game.winnerName = gameState.board.snakes[0].name;
}

function createEmptyReportObj() {
  let rep = {};

  rep.total = {
    total: 0,
    won: 0,
    lost: 0,
    tied: 0,
    winPercentage: 0,
    arenaGames: 0,
    nonArenaGames: 0,
    slowestMove: 0,
    exceptions: 0
  };

  rep.standard = {
    total: 0,
    won: 0,
    lost: 0,
    tied: 0,
    winPercentage: 0
  };

  rep.royale = {
    total: 0,
    won: 0,
    lost: 0,
    tied: 0,
    winPercentage: 0
  };

  rep.duel = {
    total: 0,
    won: 0,
    lost: 0,
    tied: 0,
    winPercentage: 0
  };

  rep.winners = [];

  return rep;
}

function getReportObj(game) {

  // eslint-disable-next-line no-undef
  const path = `${__dirname}/../report/report.json`;
  let rep;

  try {
    rep = jsonfile.readFileSync(path);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      log.info('Report file does not exist, creating new.');
      rep = createEmptyReportObj();
    } else if (err) log.error(`ex in reporter.report.readFile: ${err}`);
  }

  rep.total.total++;
  if (game.won) rep.total.won++;
  else if (game.tie) rep.total.tied++;
  else rep.total.lost++;

  rep.total.winPercentage = Math.floor(rep.total.won / rep.total.total * 100);

  if (game.source == 'arena') rep.total.arenaGames++;
  else rep.total.nonArenaGames++;

  if (game.slowestMove > rep.total.slowestMove) rep.total.slowestMove = game.slowestMove;
  rep.total.exceptions = rep.total.exceptions + game.exceptions;

  if (game.gameType === 'standard') {
    rep.standard.total++;
    if (game.won) rep.standard.won++;
    else if (game.tie) rep.standard.tied++;
    else rep.standard.lost++;
    rep.standard.winPercentage = Math.floor(rep.standard.won / rep.standard.total * 100);
  }

  if (game.gameType === 'royale') {
    rep.royale.total++;
    if (game.won) rep.royale.won++;
    else if (game.tie) rep.royale.tied++;
    else rep.royale.lost++;
    rep.royale.winPercentage = Math.floor(rep.royale.won / rep.royale.total * 100);
  }

  if (game.gameType === 'duel') {
    rep.duel.total++;
    if (game.won) rep.duel.won++;
    else if (game.tie) rep.duel.tied++;
    else rep.duel.lost++;
    rep.duel.winPercentage = Math.floor(rep.duel.won / rep.duel.total * 100);
  }

  if (!game.won && !game.tied) {

    let exists = false;
    rep.winners.forEach(winner => {
      if (game.winnerName == winner.name) {
        winner.count++;
        exists = true;
      }
    });

    if (!exists) {
      rep.winners.push({
        name: game.winnerName,
        count: 1
      });
    }

    if (rep.winners.length > 1) {
      rep.winners = rep.winners.sort((a, b) => {
        return b.count - a.count;
      });
    }
  }
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
  prepareGameReport,
  getReportObj,
  saveReport
};