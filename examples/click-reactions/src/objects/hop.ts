import {
  ActionContext,
  ActionSequence,
  Actor,
  CollisionType,
  Color,
  EasingFunctions,
  ParallelActions,
  RotationType,
  Vector,
} from "excalibur";
import config from "../config";
import { ResourceManager } from "./resource-manager";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

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
    this.on("pointerdown", (_event: PointerEvent) => {
      const hopSequence = new ActionSequence(
        this,
        (actionContext: ActionContext): any => {
          actionContext
            .easeTo(
              this.pos.add(new Vector(0, -100)),
              200,
              EasingFunctions.EaseOutQuad
            )
            .easeTo(this.pos, 200, EasingFunctions.EaseInQuad)
            .easeTo(
              this.pos.add(new Vector(0, -100)),
              200,
              EasingFunctions.EaseOutQuad
            )
            .easeTo(this.pos, 200, EasingFunctions.EaseInQuad);
        }
      );

      const rotateSequence = new ActionSequence(
        this,
        (actionContext: ActionContext) => {
          actionContext
            .rotateTo(Math.PI * 0.25, 4, RotationType.Clockwise)
            .rotateTo(0, 4, RotationType.CounterClockwise)
            .rotateTo(-Math.PI * 0.25, 4, RotationType.CounterClockwise)
            .rotateTo(0, 4, RotationType.Clockwise);
        }
      );

      const parallelActions = new ParallelActions([
        hopSequence,
        rotateSequence,
      ]);
      this.actions.runAction(parallelActions);
    });
  }
}
