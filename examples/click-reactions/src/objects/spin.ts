import { Actor, CollisionType, Color, RotationType } from "excalibur";
import { config } from "../config";
import { ResourceManager } from "./resource-manager";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class Spin extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: config.edgeLength,
      height: config.edgeLength,
      color: Color.Orange,
      collisionType: CollisionType.PreventCollision,
    });

    const sprite = ResourceManager.getJK01Sprite();
    this.graphics.use(sprite);

    this.initReactions();
  }

  private initReactions(): void {
    this.on("pointerdown", (_event: PointerEvent) => {
      this.actions.clearActions();
      this.actions
        .rotateTo(Math.PI * 2, 20, RotationType.Clockwise)
        .rotateTo(Math.PI * 2, 20, RotationType.Clockwise);
    });
  }
}
