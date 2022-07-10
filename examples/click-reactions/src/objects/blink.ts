import { Actor, CollisionType, Color } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import config from "../config";
import { ResourceManager } from "./resource-manager";

export class Blinker extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: config.edgeLength,
      height: config.edgeLength,
      color: Color.Orange,
      collisionType: CollisionType.PreventCollision,
    });

    const sprite = ResourceManager.getJK12Sprite();
    this.graphics.use(sprite);

    this.initReactions();
  }

  private initReactions(): void {
    this.on("pointerdown", (event: PointerEvent) => {
      this.actions.blink(100, 100, 5);
    });
  }
}
