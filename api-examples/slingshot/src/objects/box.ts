import { Actor, CollisionType, Engine } from "excalibur";
import { config } from "../config";
import { ResourceManager } from "./resource-manager";

export class Box extends Actor {
  constructor(x: number, y: number, edgeLength: number) {
    super({
      x: x,
      y: y,
      width: edgeLength,
      height: edgeLength,
      collisionType: CollisionType.Active,
    });

    const sprite = ResourceManager.getBoxSprite(edgeLength);
    this.graphics.use(sprite);
  }

  onInitialize(_engine: Engine) {
    this.body.mass = config.boxMass;
  }
}
