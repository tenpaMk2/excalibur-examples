import { Actor, CollisionType, Color, Vector } from "excalibur";

export class Paddle extends Actor {
  public flickTargets: Actor[];

  constructor(pos: Vector, width: number, height: number) {
    super({
      pos: pos,
      color: Color.Green,
      width: width,
      height: height,
      collisionType: CollisionType.Fixed,
    });
  }
}
