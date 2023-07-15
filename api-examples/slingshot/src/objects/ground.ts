import { Actor, CollisionType, Color } from "excalibur";

export class Ground extends Actor {
  constructor(x: number, y: number, width: number, height: number) {
    super({
      x: x,
      y: y,
      width: width,
      height: height,
      color: Color.Viridian,
      collisionType: CollisionType.Fixed,
    });
  }
}
