import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
  Vector,
} from "excalibur";

export class Blast extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      radius: 100,
      color: Color.Rose,
      collisionType: CollisionType.Passive,
      collisionGroup: CollisionGroupManager.groupByName("bowman"),
    });
  }

  onInitialize(_engine: Engine): void {
    this.graphics.opacity = 0.3;

    this.scale = new Vector(0.1, 0.1);
    this.actions
      .scaleTo(new Vector(1, 1), new Vector(10, 10))
      .delay(1000)
      .scaleTo(new Vector(0.5, 0.5), new Vector(10, 10))
      .die();
  }
}
