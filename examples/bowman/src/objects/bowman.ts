import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Engine,
  SpriteSheet,
  Vector,
} from "excalibur";
import { Resources } from "../resource";
import { Arrow, ArrowType } from "./arrow";
import { BowType } from "./bow-select-event";
import { ResourceManager } from "./resource-manager";

export class Bowman extends Actor {
  private bow!: Actor;
  private bowType: BowType = "Normal";

  constructor(private engine: Engine, x: number, y: number) {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.bowman,
      grid: {
        rows: 8,
        columns: 17,
        spriteWidth: 24, // pixels
        spriteHeight: 32, // pixels
      },
    });
    const sprite = spriteSheet.getSprite(0, 1)!;

    super({
      x: x,
      y: y,
      width: sprite.width,
      height: sprite.height,
      collisionType: CollisionType.Fixed,
      collisionGroup: CollisionGroupManager.groupByName("bowman"),
    });

    this.graphics.use(sprite);
  }

  onInitialize(engine: Engine): void {
    this.bow = new Actor({
      pos: Vector.Zero,
      anchor: new Vector(0, 0.5),
      collisionType: CollisionType.PreventCollision,
    });
    engine.add(this.bow);
    this.addChild(this.bow);

    this.changeBow("Normal");
  }

  shoot(power: number, angle: number) {
    this.bow.rotation = angle;

    let arrowType: ArrowType;
    switch (this.bowType) {
      case "Normal":
        arrowType = "Normal";
        break;

      case "Metal":
        arrowType = "Bomb";
        break;

      case "Hell":
        arrowType = "Hell";
        break;
    }

    const arrow = new Arrow(
      this.pos.x + this.width / 2,
      this.pos.y,
      power,
      angle,
      arrowType
    );
    this.engine.add(arrow);
  }

  changeBow(bowType: BowType) {
    switch (bowType) {
      case "Normal":
        this.bow.graphics.use(ResourceManager.getNormalBowSprite());
        break;
      case "Metal":
        this.bow.graphics.use(ResourceManager.getMetalBowSprite());
        break;
      case "Hell":
        this.bow.graphics.use(ResourceManager.getHellBowSprite());
        break;
    }
    this.bowType = bowType;
  }
}
