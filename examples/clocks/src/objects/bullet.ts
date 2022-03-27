import { Actor, CollisionType, Color, Engine, Vector } from "excalibur";

export class Bullet extends Actor {
  constructor(pos: Vector, angle: number) {
    super({
      pos: pos,
      collisionType: CollisionType.Passive,
      radius: 20,
      color: Color.Rose,
    });

    this.vel = Vector.fromAngle(angle - Math.PI / 2).scale(300);
    this.rotation = angle;
  }

  onPreUpdate = (engine: Engine, delta: number): void => {};
}
