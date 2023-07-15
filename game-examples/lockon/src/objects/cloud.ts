import {
  Actor,
  CollisionType,
  Engine,
  ExitViewPortEvent,
  Vector,
} from "excalibur";
import { config } from "../config";
import { cloudSprite } from "../resources";

export class Cloud extends Actor {
  constructor(y: number) {
    super({
      x: -config.cloudWidth / 2,
      y: y,
      vel: Vector.Right.scale(config.cloudFlowSpeed),
      collisionType: CollisionType.PreventCollision,
    });
  }

  onInitialize = (engine: Engine) => {
    this.initGraphics();

    this.on("exitviewport", (_event: ExitViewPortEvent) => {
      const newOne = new Cloud(this.pos.y);
      this.kill();
      engine.add(newOne);
    });
  };

  initGraphics = () => {
    this.graphics.use(cloudSprite);
    this.graphics.opacity = 0.7;
  };
}
