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

const Resources = {
  ball: new ImageSource(ballPng),
  missile: new ImageSource(missilePng),
  lockon: new ImageSource(lockonPng),
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
};
