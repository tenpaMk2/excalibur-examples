import { Actor, CollisionType, Engine, Vector } from "excalibur";
import config from "../config";
import { skySprite } from "../resources";

export class Sky extends Actor {
  constructor(private engine: Engine) {
    super({
      anchor: Vector.Zero,
      collisionType: CollisionType.PreventCollision,
    });

    this.initGraphics();

    engine.add(this);
  }

  initGraphics = () => {
    const sprite = skySprite;
    sprite.width = config.gameWidth;
    sprite.height = config.gameHeight;
    this.graphics.use(sprite);
  };
}
