import { Actor, CollisionType, Color, Vector } from "excalibur";
import { Resources } from "../resource";

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
    this.initGraphics(radius * 2);
  }

  initGraphics = (length: number) => {
    const sprite = Resources.ball.toSprite();
    sprite.width = length;
    sprite.height = length;
    this.graphics.use(sprite);
  };
}
