function distance(x1, y1, x2, y2) {
  return Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)));
}

function getDirection(pos, target) {
  if (!pos || !target) return '';
  if (pos.x > target.x) return 'left';
  else if (pos.x < target.x) return 'right';
  else if (pos.y > target.y) return 'down';
  else if (pos.y < target.y) return 'up';
}

function checkNeck(head, neck, moves) {
  if (neck.x < head.x) {
    moves.left = false;
  } else if (neck.x > head.x) {
    moves.right = false;
  } else if (neck.y < head.y) {
    moves.down = false;
  } else if (neck.y > head.y) {
    moves.up = false;
  }
}

function checkUp(head, target) {
  return (head.y + 1) == target.y && head.x == target.x;
}
function checkDown(head, target) {
  return (head.y - 1) == target.y && head.x == target.x;
}

function checkLeft(head, target) {
  return (head.x - 1) == target.x && head.y == target.y;
}

function checkRight(head, target) {
  return (head.x + 1) == target.x && head.y == target.y;
}


function checkWalls(head, board, moves) {
  if (head.x == board.width - 1) {
    moves.right = false;
  }
  if (head.x == 0) {
    moves.left = false;
  }
  if (head.y == board.height - 1) {
    moves.up = false;
  }
  if (head.y == 0) {
    moves.down = false;
  }
}

function checkBody(head, body, moves) {
  body.forEach(part => {
    if (checkRight(head, part)) {
      moves.right = false;
    }
    if (checkLeft(head, part)) {
      moves.left = false;
    }
    if (checkUp(head, part)) {
      moves.up = false;
    }
    if (checkDown(head, part)) {
      moves.down = false;
    }
  });
}

function checkSnakes(head, snakes, moves) {
  snakes.forEach(snake => {
    checkBody(head, snake.body, moves);
  });
}

function prepareReport(gameState, game) {
  console.log(game);
  let winnerName = false;
  let won = false;
  let turns = gameState.turn;

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
}

function report(games) {
  const gamesWon = games.filter(g => g.won);
  const gamesLost = games.filter(g => !g.won);
  const winPercent = Math.floor(gamesWon.length / games.length * 100);

  // First, show the win rate
  let body = `After ${games.length} games, you have ${gamesWon.length} wins for rate of ${winPercent}%`;

  // Next, find the people who defeated me the most
  const winnersNames = gamesLost.map((game) => game.winnerName);
  const rankedWinners = winnersNames.sort((a, b) => {
    winnersNames.filter(w => w === a).length - winnersNames.filter(w => w === b).length;
  });

  const highestWinner = rankedWinners[0];
  const highestWinnerCount = rankedWinners.filter(w => w === highestWinner).length;
  body += `\nYou lost the most to ${highestWinner} (${highestWinnerCount} times)`;
  return body;
}

module.exports = {
  distance,
  getDirection,
  checkNeck,
  checkWalls,
  checkBody,
  checkSnakes,
  prepareReport,
  report
};