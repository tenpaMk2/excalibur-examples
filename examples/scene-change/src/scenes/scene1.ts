import { Actor, Color, Engine, Events, Scene } from "excalibur";

export class Scene1 extends Scene {
  onInitialize(_engine: Engine): void {
    const actor = new Actor({
      x: _engine.halfDrawWidth,
      y: _engine.halfDrawHeight,
      width: 20,
      height: 20,
      color: Color.Magenta,
    });
    _engine.add(actor);

    _engine.input.pointers.primary.on(
      "down",
      (event: Events.pointerdown): void => {
        _engine.goToScene("scene2");
      }
    );
  }
}
