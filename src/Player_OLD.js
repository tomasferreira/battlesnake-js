const { distance, getDirection, checkNeck, checkWalls, checkBody, checkSnakes } = require('./utils');

class Player {
  constructor() {

  }
  move(gameState) {
    const head = gameState.you.head;
    const neck = gameState.you.body[1];
    const board = gameState.board;
    const body = gameState.you.body;
    const snakes = gameState.board.snakes.filter(snake => snake.name != gameState.you.name);

    let possibleMoves = {
      up: true,
      down: true,
      left: true,
      right: true
    };
    let move = {};

    // Step 0: Don't let your Battlesnake move back on its own neck
    checkNeck(head, neck, possibleMoves);

    // Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    checkWalls(head, board, possibleMoves);


    // Step 2 - Don't hit yourself.
    // Use information in gameState to prevent your Battlesnake from colliding with itself.
    checkBody(head, body, possibleMoves);

    // Step 3 - Don't collide with others.
    // Use information in gameState to prevent your Battlesnake from colliding with others.
    checkSnakes(head, snakes, possibleMoves);

    // Step 4 - Find food.
    // Use information in gameState to seek out and find food.
    const food = gameState.board.food;
    food.sort((a, b) => {
      return distance(head.x, head.y, a.x, a.y) - distance(head.x, head.y, b.x, b.y);
    });

    const target = food[0];
    // console.log('target', target);
    let direction = getDirection(head, target);
    let shout = 'GOING ';

    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key]);
    // console.log(JSON.stringify(safeMoves));

    if (direction && safeMoves.includes(direction)) {
      move = direction;
      shout += direction;
      // console.log('is safe: ' + direction);
    } else {
      move = safeMoves[Math.floor(Math.random() * safeMoves.length)];
      shout += move;
      // console.log('random: ' + move);
    }
    return {
      move: move,
      shout: shout
    };
  }
}
module.exports = Player;