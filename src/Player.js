const { buildGrid } = require('./grid');

class Player {
  move(data){
    const health = data.you.health;
    const turn = data.turn;

    let grid = buildGrid(data);
   
  }
}

module.exports = Player;