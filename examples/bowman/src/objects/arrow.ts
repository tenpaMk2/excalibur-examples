import {
  Actor,
  CollisionGroupManager,
  CollisionStartEvent,
  CollisionType,
  Engine,
  ExitViewPortEvent,
  Sprite,
  Vector,
} from "excalibur";
import { Resources } from "../resource";

export class Arrow extends Actor {
  rotatable: boolean = true;

  constructor(
    x: number,
    y: number,
    private power: number,
    private angle: number
  ) {
    super({
      x: x,
      y: y,
      width: 10,
      height: 10,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("bowman"),
      anchor: new Vector(0.5, 0.0),
    });
  }

  onInitialize(engine: Engine) {
    const sprite = this.generateArrowSprite();
    this.graphics.use(sprite);

    this.vel = Vector.fromAngle(this.angle).scale(this.power);

    this.on("collisionstart", (event: CollisionStartEvent<Actor>) => {
      if (this.parent) return; // This avoid multiple parents when the arrow collides 2 objects at the same time.
      this.rotatable = false;

      this.vel = Vector.Zero;
      this.angularVelocity = 0;

      this.body.collisionType = CollisionType.Fixed;

      event.other.addChild(this);
      this.pos = this.pos.sub(event.other.pos);

      engine.clock.schedule(() => {
        this.kill();
      }, 3000);
    });

    this.on("exitviewport", (event: ExitViewPortEvent) => {
      if (this.pos.y < 0) return;
      this.kill();
    });
  }

  private generateArrowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 18,
        y: 108,
        width: 10,
        height: 54,
      },
    });
  }

  onPreUpdate(engine: Engine, delta: number) {
    if (this.rotatable) this.rotation = this.vel.toAngle() + Math.PI * 0.5;
  }
}
