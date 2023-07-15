import { Actor, Canvas, Engine, ScreenElement, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { BracingEvent } from "./bracing-event";

export class TapUI {
  eventPubSuber: Actor;

  constructor(engine: Engine) {
    this.eventPubSuber = new Actor();

    let dragUI: ScreenElement;

    engine.input.pointers.primary.on("down", (event: PointerEvent): void => {
      if (dragUI) dragUI.kill(); // if you right-click, this process is needed.

      dragUI = new ScreenElement({
        pos: event.screenPos,
      });
      engine.add(dragUI);

      engine.input.pointers.primary.on("move", (event: PointerEvent): void => {
        const canvas = new Canvas({
          width: engine.drawWidth,
          height: 32, // must be 2^n
          draw: (ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "red";
            const length = event.screenPos.distance(dragUI.pos);
            ctx.fillRect(0, 0, length, 32);
          },
        });
        dragUI.graphics.use(canvas);
        dragUI.anchor = new Vector(0, 0.5);

        const rotation = event.screenPos.sub(dragUI.pos).toAngle();
        dragUI.rotation = rotation;
      });
    });

    engine.input.pointers.primary.on("up", (event: PointerEvent): void => {
      if (!dragUI) return;
      dragUI.kill();

      engine.input.pointers.primary.off("move");

      this.eventPubSuber.emit(
        "brace",
        new BracingEvent(
          event.screenPos.distance(dragUI.pos),
          event.screenPos.sub(dragUI.pos).toAngle() + Math.PI,
        ),
      );
    });
  }
}
