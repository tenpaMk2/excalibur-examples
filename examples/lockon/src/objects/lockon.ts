import { Actor, CollisionType, Engine, Vector } from "excalibur";
import { lockonSprite } from "../resources";

export class Lockon extends Actor {
  constructor() {
    super({
      pos: Vector.Zero,
      collisionType: CollisionType.PreventCollision,
    });

    this.initGraphics();
  }

  initGraphics = () => {
    const sprite = lockonSprite;
    sprite.width = 100;
    sprite.height = 100;
    this.graphics.use(sprite);
  };

  onInitialize = (engine: Engine) => {
    this.actions
      // .rotateTo(Math.PI / 4, Math.PI)
      .scaleTo(new Vector(0.5, 0.5), new Vector(10, 10));
  };

  onPreUpdate = (engine: Engine, delta: number) => {
    const globalRotation = this.getGlobalRotation();
    this.rotation -= globalRotation;
  };
}
