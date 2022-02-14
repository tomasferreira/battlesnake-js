const { distance, getDirection } = require('./utils');

class Player {
  constructor() {

  }

  move(gameState) {
    let possibleMoves = {
      up: true,
      down: true,
      left: true,
      right: true
    };
    let move = {};

    // Step 0: Don't let your Battlesnake move back on its own neck
    const myHead = gameState.you.head;
    const myNeck = gameState.you.body[1];
    if (myNeck.x < myHead.x) {
      possibleMoves.left = false;
    } else if (myNeck.x > myHead.x) {
      possibleMoves.right = false;
    } else if (myNeck.y < myHead.y) {
      possibleMoves.down = false;
    } else if (myNeck.y > myHead.y) {
      possibleMoves.up = false;
    }

    // TODO: Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    const boardWidth = gameState.board.width;
    const boardHeight = gameState.board.height;
    if (myHead.x == boardWidth - 1) {
      possibleMoves.right = false;
    }
    if (myHead.x == 0) {
      possibleMoves.left = false;
    }
    if (myHead.y == boardHeight - 1) {
      possibleMoves.up = false;
    }
    if (myHead.y == 0) {
      possibleMoves.down = false;
    }


    // TODO: Step 2 - Don't hit yourself.
    // Use information in gameState to prevent your Battlesnake from colliding with itself.
    // const mybody = gameState.you.body

    // TODO: Step 3 - Don't collide with others.
    // Use information in gameState to prevent your Battlesnake from colliding with others.

    // TODO: Step 4 - Find food.
    // Use information in gameState to seek out and find food.
    const food = gameState.board.food;
    food.sort((a, b) => {
      return distance(myHead.x, myHead.y, a.x, a.y) - distance(myHead.x, myHead.y, b.x, b.y);
    });

    const target = food[0];
    console.log(target);
    let direction = getDirection(myHead, target);

    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key]);
    console.log(JSON.stringify(safeMoves));

    if (safeMoves.includes(direction)) {
      move = direction;
      console.log('is safe: ' + direction);
    } else {
      move = safeMoves[Math.floor(Math.random() * safeMoves.length)];
      console.log('random: ' + move);
    }
    return { move: move };
  }
}

module.exports = Player;