import { Actor, Color, Engine } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { DeathEvent } from "./my-event";

export class Square extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: 20,
      height: 20,
      color: Color.Magenta,
    });
  }

  onInitialize(_engine: Engine) {
    this.on("pointerdown", (_event: PointerEvent) => {
      const time = new Date();
      this.emit("death", new DeathEvent(time.toString(), time.getTime()));
    });
  }
}
