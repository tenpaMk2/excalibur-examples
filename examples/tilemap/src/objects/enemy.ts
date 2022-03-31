import { Actor, Engine, SpriteSheet, Vector } from "excalibur";
import { Resources } from "../resource";
import { Creature } from "./creature";

export class Enemy extends Actor implements Creature {
  HP = 10;
  offence = 3;
  defence = 1;

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
