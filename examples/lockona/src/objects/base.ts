import { Actor, CollisionGroup, CollisionType, Color, Vector } from "excalibur";
import { Resources } from "../resource";

export class Base extends Actor {
  constructor(x: number, y: number, radius: number) {
    super({
      x: x,
      y: y,
      radius: radius,
      color: Color.Orange,
      collisionType: CollisionType.Passive,
    });
    this.body.useGravity = false;

    this.initGraphics(radius * 2);

    this.angularVelocity = Math.PI;
  }

  initGraphics = (length: number) => {
    const sprite = Resources.ball.toSprite();
    sprite.width = length;
    sprite.height = length;
    this.graphics.use(sprite);
  };
}
