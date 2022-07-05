import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Engine,
  Sprite,
  SpriteSheet,
  Vector,
} from "excalibur";
import { Resources } from "../resource";
import { Arrow } from "./arrow";

export class Bowman extends Actor {
  private bow!: Actor;

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

    const sprite = this.generateBowSprite();
    this.bow.graphics.use(sprite);
  }

  shoot(power: number, angle: number) {
    this.bow.rotation = angle;

    const arrow = new Arrow(
      this.pos.x + this.width / 2,
      this.pos.y,
      power,
      angle
    );
    this.engine.add(arrow);
  }

  private generateBowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 10,
        y: 12,
        width: 44,
        height: 70,
      },
    });
  }
}
