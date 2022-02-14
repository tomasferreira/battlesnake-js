function distance(x1, y1, x2, y2) {
  return Math.sqrt((Math.pow(x2 - x1, 2)) + (Math.pow(y2 - y1, 2)));
}

function getDirection(pos, target) {
  if (pos.x > target.x) return 'left';
  else if (pos.x < target.x) return 'right';
  else if (pos.y > target.y) return 'down';
  else if (pos.y < target.y) return 'up';
}

module.exports = {
  distance: distance,
  getDirection: getDirection
};