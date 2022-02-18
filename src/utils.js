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

module.exports = {
  distance,
  getDirection,
  checkNeck,
  checkWalls,
  checkBody,
  checkSnakes
};