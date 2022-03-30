import { Actor, Engine, SpriteSheet, Vector } from "excalibur";
import { Resources } from "../resource";

export class Enemy extends Actor {
  shaft: Actor;
  constructor(pos: Vector, unitLength: number) {
    super({
      pos: pos,
      width: unitLength,
      height: unitLength,
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

    const sprite = bodySpriteSheet.getSprite(0, 10);
    sprite.width = unitLength;
    sprite.height = unitLength;
    this.graphics.use(sprite);
  }

  onInitialize = (engine: Engine) => {};
}
