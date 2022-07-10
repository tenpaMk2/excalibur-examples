import { Actor, CollisionType, Color, Engine, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class Paddle extends Actor {
  constructor(pos: Vector, width: number, height: number) {
    super({
      pos: pos,
      color: Color.Green,
      width: width,
      height: height,
      collisionType: CollisionType.Fixed,
    });
  }

  onInitialize(engine: Engine) {
    engine.input.pointers.primary.on("move", (event: PointerEvent) => {
      this.pos.x = event.worldPos.x;
    });
  }
}
