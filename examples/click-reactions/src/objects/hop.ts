import {
  Actor,
  CollisionType,
  Color,
  EasingFunctions,
  Vector,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import config from "../config";
import { ResourceManager } from "./resource-manager";

export class Hop extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: config.edgeLength,
      height: config.edgeLength,
      color: Color.Orange,
      collisionType: CollisionType.PreventCollision,
    });

    const sprite = ResourceManager.getJK04Sprite();
    this.graphics.use(sprite);

    this.initReactions();
  }

  private initReactions(): void {
    this.on("pointerdown", (event: PointerEvent) => {
      this.actions.repeat((repeatContext) => {
        repeatContext
          .easeTo(
            this.pos.add(Vector.Up.scale(100)),
            100,
            EasingFunctions.EaseOutQuad
          )
          .easeTo(this.pos, 100, EasingFunctions.EaseInQuad);
      }, 2);
    });
  }
}
