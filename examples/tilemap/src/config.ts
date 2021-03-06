const gameWidth = 1080 / 2;
const gameHeight = 1920 / 2;

export default {
  TileWidth: 64, // pixels
  gameWidth: gameWidth, // not pixels when fit screen!!
  gameHeight: gameHeight, // not pixels when fit screen!!
  tapAreaX1: gameWidth * 0.25,
  tapAreaX2: gameWidth * 0.75,
  tapAreaY1: gameHeight * 0.25,
  tapAreaY2: gameHeight * 0.75,
};
