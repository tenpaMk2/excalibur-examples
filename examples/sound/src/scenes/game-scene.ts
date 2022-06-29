import { Actor, Color, Engine, Font, Label, Scene, TextAlign } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { Resources } from "../resource";

export class GameScene extends Scene {
  onInitialize(_engine: Engine): void {
    const actor = new Actor({
      x: _engine.halfDrawWidth,
      y: _engine.halfDrawHeight,
      radius: 20,
      color: Color.Magenta,
    });
    actor.onInitialize = (engine: Engine): void => {
      Resources.sound1.play();

      actor.on("pointerdown", (event: PointerEvent): void => {
        Resources.sound2.play();
      });
    };
    _engine.add(actor);

    const label = new Label({
      x: _engine.halfDrawWidth,
      y: _engine.halfDrawHeight + 32 * 2,
      text: "↑tap to play↑",
      font: new Font({
        textAlign: TextAlign.Center,
        color: Color.White,
        size: 32,
      }),
    });
    _engine.add(label);
  }
}
