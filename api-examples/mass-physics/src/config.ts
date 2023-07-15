const gameWidth = 1080 / 2;
const gameHeight = 1920 / 2;

export const config = {
  gameWidth,
  gameHeight,
  minBallRadius: gameWidth / 40,
  maxBallRadius: gameWidth / 10,
  NumOfBalls: 60,
  gravity: 980,
  randomSeed: 1234,
  ballBounciness: 0.5,
  groundBounciness: 0.5,
};
