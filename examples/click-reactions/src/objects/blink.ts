import {
  ActionContext,
  ActionSequence,
  Actor,
  CollisionType,
  Color,
  Engine,
  ParallelActions,
  RotationType,
  Vector,
} from "excalibur";
import config from "../config";
import { ResourceManager } from "./resource-manager";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class Blinker extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y + config.edgeLength / 2,
      width: config.edgeLength,
      height: config.edgeLength,
      color: Color.Orange,
      collisionType: CollisionType.PreventCollision,
      anchor: new Vector(0.5, 1),
    });
  }

  onInitialize(_engine: Engine) {
    const sprite = ResourceManager.getJK12Sprite();
    this.graphics.use(sprite);

    this.initReactions();
  }

  private initReactions(): void {
    this.on("pointerdown", (_event: PointerEvent) => {
      const blinkSequence = new ActionSequence(
        this,
        (actionContext: ActionContext): any => {
          actionContext.blink(100, 100, 5);
        }
      );

      const rotateSequence = new ActionSequence(
        this,
        (actionContext: ActionContext) => {
          actionContext.rotateTo(Math.PI * 0.5, 2, RotationType.Clockwise);
        }
      );

      const parallelActions = new ParallelActions([
        blinkSequence,
        rotateSequence,
      ]);
      this.actions.runAction(parallelActions);
    });
  }
}
