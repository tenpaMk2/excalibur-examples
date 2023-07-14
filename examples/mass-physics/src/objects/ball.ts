import {
  Actor,
  CollisionType,
  Engine,
  ExitViewPortEvent,
  Random,
} from "excalibur";
import config from "../config";
import { ResourceManager } from "./resource-manager";

export class Ball extends Actor {
  constructor(x: number, y: number, radius: number, rnd: Random) {
    super({
      x: x,
      y: y,
      radius: radius,
      collisionType: CollisionType.Active,
    });

    const sprite = ResourceManager.getRandomVillagerSprite(rnd, radius);
    this.graphics.use(sprite);
  }

  onInitialize(_engine: Engine) {
    this.body.bounciness = config.ballBounciness;

    this.on("exitviewport", (_event: ExitViewPortEvent) => {
      this.kill();
    });
  }
}
