import { Actor, Color, Engine, Font, Label, Scene, TextAlign } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { Resources } from "../resource";

export class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    const actor = new Actor({
      x: engine.halfDrawWidth,
      y: engine.halfDrawHeight,
      radius: 20,
      color: Color.Magenta,
    });
    actor.onInitialize = (_engine: Engine): void => {
      Resources.sound1.play();

      actor.on("pointerdown", (_event: PointerEvent): void => {
        Resources.sound2.play();
      });
    };
    engine.add(actor);

    const label = new Label({
      x: engine.halfDrawWidth,
      y: engine.halfDrawHeight + 32 * 2,
      text: "↑tap to play↑",
      font: new Font({
        textAlign: TextAlign.Center,
        color: Color.White,
        size: 32,
      }),
    });
    engine.add(label);
  }
}
