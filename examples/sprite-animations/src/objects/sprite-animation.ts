import { Actor, Animation, CollisionType, SpriteSheet } from "excalibur";
import config from "../config";
import { Resources } from "../resource";

export class SpriteAnimation extends Actor {
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
      image: Resources.JK01,
      grid: {
        rows: 4,
        columns: 3,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });
    const sprite0 = spriteSheet.getSprite(0, 0);
    if (!sprite0) return;
    sprite0.width = config.length;
    sprite0.height = config.length;
    const sprite1 = spriteSheet.getSprite(1, 0);
    if (!sprite1) return;
    sprite1.width = config.length;
    sprite1.height = config.length;
    const sprite2 = spriteSheet.getSprite(2, 0);
    if (!sprite2) return;
    sprite2.width = config.length;
    sprite2.height = config.length;

    const animation = new Animation({
      frames: [
        {
          graphic: sprite0,
          duration: 300,
        },
        {
          graphic: sprite1,
          duration: 300,
        },
        {
          graphic: sprite2,
          duration: 300,
        },
        {
          graphic: sprite1,
          duration: 300,
        },
      ],
    });

    this.graphics.use(animation);
  };
}
