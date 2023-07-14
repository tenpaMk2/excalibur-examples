import { Actor, Color, Engine, Scene, Vector } from "excalibur";

export class Scene2 extends Scene {
  onInitialize(engiine: Engine): void {
    engiine.start();
    const actor = new Actor({
      pos: Vector.Zero,
      width: 1000,
      height: 1000,
      color: Color.Cyan,
    });

    engiine.add(actor);
  }
}
