const games = {};
function distance(x1, y1, x2, y2) {
    return Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)));
}
function getDirection(pos, target) {
    if(pos.x > target.x) return 'left'
    else if(pos.x < target.x) return 'right'
    else if(pos.y > target.y) return 'down'
    else if(pos.y < target.y) return 'up'
}

function info() {
    const response = {
        apiversion: "1",
        author: "",
        color: "#FF0000",
        head: "default",
        tail: "default"
    }
    return response
}

function start(gameState) {
    console.log(`${gameState.game.id} START`);
    games[gameState.game.id] = {
        turn: 0
    };
}

function end(gameState) {
    console.log(`${gameState.game.id} END\n`)
}

function move(gameState) {
    const gameID = gameState.game.id;
    console.log('turn ' + games[gameID].turn++);
    let possibleMoves = {
        up: true,
        down: true,
        left: true,
        right: true
    }

    // Step 0: Don't let your Battlesnake move back on its own neck
    const myHead = gameState.you.head
    const myNeck = gameState.you.body[1]
    if (myNeck.x < myHead.x) {
        possibleMoves.left = false
    } else if (myNeck.x > myHead.x) {
        possibleMoves.right = false
    } else if (myNeck.y < myHead.y) {
        possibleMoves.down = false
    } else if (myNeck.y > myHead.y) {
        possibleMoves.up = false
    }

    // TODO: Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    const boardWidth = gameState.board.width
    const boardHeight = gameState.board.height
    if (myHead.x == boardWidth -1) {
        possibleMoves.right = false;
    }
    if (myHead.x == 0) {
        possibleMoves.left = false;
    }
    if (myHead.y == boardHeight -1) {
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
    })

    const target = food[0];
    let direction = getDirection(myHead, target);

    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    console.log(JSON.stringify(safeMoves));

    if (safeMoves.includes(direction)) {
        console.log('is safe');
        return {
            move: direction
        }
    } else {
        console.log('random');
        return {
            move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
        }
    }

    // Finally, choose a move from the available safe moves.
    // TODO: Step 5 - Select a move to make based on strategy, rather than random.
}

module.exports = {
    info: info,
    start: start,
    move: move,
    end: end
}
