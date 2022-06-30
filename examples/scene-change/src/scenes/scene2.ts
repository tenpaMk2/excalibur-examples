import { Actor, Color, Engine, Scene, Vector } from "excalibur";

export class Scene2 extends Scene {
  onInitialize(_engine: Engine): void {
    _engine.start();
    const actor = new Actor({
      pos: Vector.Zero,
      width: 1000,
      height: 1000,
      color: Color.Cyan,
    });
    _engine.add(actor);
  }
}
