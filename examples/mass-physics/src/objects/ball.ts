import { Actor, CollisionType, Engine, Random, SpriteSheet } from "excalibur";
import { Resources } from "../resource";

export class Ball extends Actor {
  constructor(x: number, y: number, radius: number) {
    super({
      x: x,
      y: y,
      radius: radius,
      collisionType: CollisionType.Active,
    });

    const bodySpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.chara,
      grid: {
        rows: 12,
        columns: 2,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
        originOffset: {
          x: 0,
          y: 0,
        },
      },
    });

    const sprite = bodySpriteSheet.getSprite(
      new Random(x * 114 + y * 514).integer(0, 1),
      new Random(x * 19 + y * 19).integer(5, 11)
    );
    sprite.width = radius * 2;
    sprite.height = radius * 2;
    this.graphics.use(sprite);
  }

  onInitialize = (engine: Engine) => {};
}
