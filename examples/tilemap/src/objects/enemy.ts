import { Actor, Engine, SpriteSheet, Vector } from "excalibur";
import config from "../config";
import { Resources } from "../resource";
import { Creature } from "./creature";
import { HPBar } from "./hp-bar";

export class Enemy extends Actor implements Creature {
  private _HP = 10;
  offence = 3;
  defence = 1;
  HPBar: HPBar;

  constructor(pos: Vector) {
    super({
      pos: pos,
      width: config.TileWidth,
      height: config.TileWidth,
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
    sprite.width = config.TileWidth;
    sprite.height = config.TileWidth;
    this.graphics.use(sprite);

    this.HPBar = new HPBar(this.HP);
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
