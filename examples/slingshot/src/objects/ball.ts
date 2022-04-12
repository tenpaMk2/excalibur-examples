import { Actor, CollisionType, Color } from "excalibur";

export class Ball extends Actor {
  constructor(x: number, y: number, radius: number) {
    super({
      x: x,
      y: y,
      radius: radius,
      color: Color.Orange,
      collisionType: CollisionType.Active,
    });
    this.body.useGravity = false;
  }
}
