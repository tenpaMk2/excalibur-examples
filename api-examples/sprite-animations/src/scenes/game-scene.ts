import { Scene, Engine } from "excalibur";
import { SpriteAnimation } from "../objects/sprite-animation";
import { SpriteSheetAnimation } from "../objects/spritesheet-animation";
import { WalkAround } from "../objects/walk-around";
import { WalkAround2 } from "../objects/walk-around2";

export class GameScene extends Scene {
  onInitialize = (engine: Engine) => {
    const spriteAnimation = new SpriteAnimation(
      (engine.drawWidth * 1) / 4,
      (engine.drawHeight * 1) / 4
    );
    engine.add(spriteAnimation);

    const spriteSheetAnimation = new SpriteSheetAnimation(
      (engine.drawWidth * 3) / 4,
      (engine.drawHeight * 1) / 4
    );
    engine.add(spriteSheetAnimation);

    const walkAround = new WalkAround(
      (engine.drawWidth * 1) / 4,
      (engine.drawHeight * 3) / 4
    );
    engine.add(walkAround);

    const walkAround2 = new WalkAround2(
      (engine.drawWidth * 3) / 4,
      (engine.drawHeight * 3) / 4
    );
    engine.add(walkAround2);
  };
}
