import { Actor, Engine, SpriteSheet, Vector } from "excalibur";
import { Resources } from "../resource";
import { HPBar } from "./hp-bar";

export class Player extends Actor {
  private _HP = 10;
  offence = 4;
  defence = 2;
  HPBar: HPBar;

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

    this.HPBar = new HPBar(this._HP, unitLength);
    this.addChild(this.HPBar);
  }

  onInitialize = (engine: Engine) => {
    engine.add(this.HPBar);
  };

  set HP(val: number) {
    this._HP = val < 0 ? 0 : val;
    this.HPBar.updateHP(this._HP);
  }

  get HP() {
    return this._HP;
  }
}
