const gameWidth = 1080 / 2;
const gameHeight = 1920 / 2;
const gameRow = 10;
const gameCol = 6;
const marginFactor = 6;

export default {
  gameWidth: gameWidth,
  gameHeight: gameHeight,
  startTime: 1000, // [ms]
  gameRow: gameRow,
  gameCol: gameCol,
  tileWidth: gameWidth / gameCol,
  tileHeight: gameHeight / (gameRow + marginFactor),
  imageScale: 2,
  foregroundTileMargin: 4,
};
