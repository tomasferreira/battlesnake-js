const keys = require('./keys');

function buildGrid(data) {
  const board = data.board;
  const self = data.you;

  //initialize with spaces
  let grid = initGrid(board.width, board.height, keys.SPACE);

  //mark edges
  for (let y = 0; y < board.height; y++) {
    grid[y][0] = keys.WALL_NEAR;
    grid[y][board.width - 1] = keys.WALL_NEAR;
  }
  for (let x = 0; x < board.width; x++) {
    grid[0][x] = keys.WALL_NEAR;
    grid[board.height - 1][x] = keys.WALL_NEAR;
  }

  // fill FOOD locations
  board.food.forEach(({ x, y }) => {
    grid[y][x] = keys.FOOD;
  });

  board.snakes.forEach(({ id, name, health, body }) => {

    // fill SNAKE_BODY locations
    body.forEach(({ x, y }) => {
      if (id === self.id) grid[y][x] = keys.YOUR_BODY;
      else grid[y][x] = keys.SNAKE_BODY;
    });

    // fill ENEMY_HEAD locations
    const head = body[0];
    const dangerSnake = body.length >= self.body.length;

    if (id != self.id) {
      if (dangerSnake) {
        grid[head.y][head.x] = keys.ENEMY_HEAD;
      }
      else {
        grid[head.y][head.x] = keys.SMALL_HEAD;
      }
    }

    // check if tail can be marked TAIL or remain SNAKE_BODY
    if (data.turn > 1 && health != 100) {
      const tail = body[body.length - 1];
      grid[tail.y][tail.x] = keys.TAIL;
    }
  });

  // fill DANGER or KILL_ZONE locations around each snake head
  board.snakes.forEach(({ id, name, health, body }) => {
    if (id == self.id) return;

    let pos = { x: 0, y: 0 };
    const head = body[0];
    let headZone = keys.DANGER;
    if (self.body.length === body.length) {
      headZone = keys.SMALL_DANGER;
    } else if (self.body.length > body.length) {
      headZone = keys.KILL_ZONE;
    }

    // check up, down, left, right
    let offsets = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 },  // right
    ];

    for (let offset of offsets) {
      pos.x = head.x + offset.x;
      pos.y = head.y + offset.y;
      if (!outOfBounds(pos, grid) && grid[pos.y][pos.x] < keys.DANGER) {
        grid[pos.y][pos.x] = headZone;
      }
    }

    // check positions snake could be in 2 moves
    let future2Offsets = [
      { x: -1, y: -1 },
      { x: -2, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: -2 }
    ];
    for (let offset of future2Offsets) {
      pos.x = head.x + offset.x;
      pos.y = head.y + offset.y;
      if (!outOfBounds(pos, grid) && grid[pos.y][pos.x] <= keys.WALL_NEAR && grid[pos.y][pos.x] != keys.FOOD) {
        grid[pos.y][pos.x] = keys.FUTURE_2;
      }
    }
  });

}

// create a grid filled with a given value
function initGrid(width, height, fillValue) {
  let grid;
  grid = new Array(height);
  for (let i = 0; i < height; i++) {
    grid[i] = new Array(width);
    for (let j = 0; j < width; j++) {
      grid[i][j] = fillValue;
    }
  }
  return grid;
}

// check if space is out of bounds
function outOfBounds(pos, grid) {
  const x = pos.x;
  const y = pos.y;
  return (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length);
}

module.exports = {
  buildGrid
};