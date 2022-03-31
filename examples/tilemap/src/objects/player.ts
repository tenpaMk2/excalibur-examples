import { Actor, Engine, SpriteSheet, Vector } from "excalibur";
import { Resources } from "../resource";

export class Player extends Actor {
  HP = 10;
  offence = 4;
  defence = 2;

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

    const partSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.chara,
      grid: {
        rows: 12,
        columns: 51,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
        originOffset: {
          x: 52,
          y: 0,
        },
      },
    });

    const sprite = bodySpriteSheet.getSprite(0, 0);
    sprite.width = unitLength;
    sprite.height = unitLength;
    this.graphics.use(sprite);

    const sprite2 = partSpriteSheet.getSprite(0, 0);
    sprite2.width = unitLength;
    sprite2.height = unitLength;
    this.graphics.show(sprite2);

    const sprite3 = partSpriteSheet.getSprite(3, 0);
    sprite3.width = unitLength;
    sprite3.height = unitLength;
    this.graphics.show(sprite3);
  }

  onInitialize = (engine: Engine) => {};
}
