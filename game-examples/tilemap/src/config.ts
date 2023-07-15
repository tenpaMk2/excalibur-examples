const gameWidth = 1080 / 2;
const gameHeight = 1920 / 2;

export const config = {
  TileWidth: 64, // pixels
  gameWidth, // Not pixels when `DisplayMode.FitScreen` is enable!!
  gameHeight, // Not pixels when `DisplayMode.FitScreen` is enable!!
  tapAreaX1: gameWidth * 0.25,
  tapAreaX2: gameWidth * 0.75,
  tapAreaY1: gameHeight * 0.25,
  tapAreaY2: gameHeight * 0.75,
};
