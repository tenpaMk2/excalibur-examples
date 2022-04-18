import { Actor, CollisionGroupManager, CollisionType, Color } from "excalibur";
import { ballSprite } from "../resources";

export class Base extends Actor {
  constructor(x: number, y: number, radius: number) {
    super({
      x: x,
      y: y,
      radius: radius,
      color: Color.Orange,
      collisionType: CollisionType.Fixed,
      collisionGroup: CollisionGroupManager.groupByName("base"),
    });
    this.body.useGravity = false;

    this.initGraphics(radius * 2);

    this.angularVelocity = Math.PI;
  }

  initGraphics = (length: number) => {
    const sprite = ballSprite;
    sprite.width = length;
    sprite.height = length;
    this.graphics.use(sprite);
  };
}
