import {
  Animation,
  AnimationStrategy,
  ImageSource,
  Loader,
  SpriteSheet,
} from "excalibur";
import ballPng from "./assets/tenpamk2-ball.png";
import missilePng from "./assets/tenpamk2-missile.png";
import lockonPng from "./assets/tenpamk2-lockon.png";
import boomPng from "./assets/tenpamk2-boom.png";
import enemyPng from "./assets/tenpamk2-enemy.png";
import cloudPng from "./assets/tenpamk2-cloud.png";
import config from "./config";

const Resources = {
  ball: new ImageSource(ballPng),
  missile: new ImageSource(missilePng),
  lockon: new ImageSource(lockonPng),
  boom: new ImageSource(boomPng),
  enemy: new ImageSource(enemyPng),
  cloud: new ImageSource(cloudPng),
};

const loader = new Loader();

const ballSprite = Resources.ball.toSprite();
const missileSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.missile,
  grid: {
    rows: 1,
    columns: 3,
    spriteHeight: 32,
    spriteWidth: 64,
  },
});
const missileAnimation = Animation.fromSpriteSheet(
  missileSpriteSheet,
  [0, 1, 2],
  1000 / 60,
  AnimationStrategy.Loop
);
const lockonSprite = Resources.lockon.toSprite();
const boomSprite = Resources.boom.toSprite();
const enemySpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.enemy,
  grid: {
    rows: 1,
    columns: 4,
    spriteHeight: 32,
    spriteWidth: 32,
  },
});
enemySpriteSheet.sprites.forEach((sprite) => {
  sprite.width = config.enemyLength;
  sprite.height = config.enemyLength;
  sprite.rotation = -Math.PI / 2;
});
const enemyAnimation = Animation.fromSpriteSheet(
  enemySpriteSheet,
  [0, 1, 2, 3],
  (1000 * 6) / 60,
  AnimationStrategy.Loop
);
const cloudSprite = Resources.cloud.toSprite();
cloudSprite.height = config.cloudHeigh;
cloudSprite.width = config.cloudWidth;

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export {
  Resources,
  loader,
  ballSprite,
  missileSpriteSheet,
  missileAnimation,
  lockonSprite,
  boomSprite,
  enemySpriteSheet,
  enemyAnimation,
  cloudSprite,
};
