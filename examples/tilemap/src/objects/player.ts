import { Actor, Engine, SpriteSheet, Vector } from "excalibur";
import config from "../config";
import { Resources } from "../resource";
import { Action, Creature } from "./creature";
import { HPBar } from "./hp-bar";

export class Player extends Actor implements Creature {
  private _HP = 10;
  readonly maxHP = this._HP;
  offence = 4;
  defence = 2;
  slowness = 100;
  timeUntilNextTurn = this.slowness;
  relationship: "friend" | "hostile" = "friend";
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
    if (!sprite) throw Error("can not get sprite!!");
    sprite.width = config.TileWidth;
    sprite.height = config.TileWidth;
    this.graphics.use(sprite);

    const sprite2 = partSpriteSheet.getSprite(0, 0);
    if (!sprite2) throw Error("can not get sprite!!");
    sprite2.width = config.TileWidth;
    sprite2.height = config.TileWidth;
    this.graphics.show(sprite2);

    const sprite3 = partSpriteSheet.getSprite(3, 0);
    if (!sprite3) throw Error("can not get sprite!!");
    sprite3.width = config.TileWidth;
    sprite3.height = config.TileWidth;
    this.graphics.show(sprite3);

    this.HPBar = new HPBar(this._HP);
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

  decideAction = () => {
    // dummy
    return Action.ComeClose;
  };
}
