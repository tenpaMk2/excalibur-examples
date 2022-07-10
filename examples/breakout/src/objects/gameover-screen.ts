import { Actor, CollisionType, Color, Vector } from "excalibur";

export class GameOverScreen extends Actor {
  constructor(width: number, height: number) {
    super({
      pos: Vector.Zero,
      color: Color.Black,
      anchor: Vector.Zero,
      width: width,
      height: height,
      collisionType: CollisionType.PreventCollision,
    });

    this.graphics.opacity = 0.3;
  }
}
