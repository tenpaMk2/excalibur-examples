import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionType,
  SpriteSheet,
} from "excalibur";
import { config } from "../config";
import { Resources } from "../resource";

export class SpriteSheetAnimation extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: config.length,
      height: config.length,
      collisionType: CollisionType.PreventCollision,
    });

    this.initGraphics();
  }

  initGraphics = () => {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.JK04,
      grid: {
        rows: 4,
        columns: 3,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });

    spriteSheet.sprites.forEach((sprite) => {
      sprite.width = config.length;
      sprite.height = config.length;
    });

    const animation = Animation.fromSpriteSheet(
      spriteSheet,
      [0, 1, 2],
      300,
      AnimationStrategy.PingPong,
    );

    this.graphics.use(animation);
  };
}
