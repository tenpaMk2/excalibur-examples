import { Actor, Color, Engine, Events, Scene } from "excalibur";

export class Scene1 extends Scene {
  onInitialize(engine: Engine): void {
    const actor = new Actor({
      x: engine.halfDrawWidth,
      y: engine.halfDrawHeight,
      width: 20,
      height: 20,
      color: Color.Magenta,
    });
    engine.add(actor);

    engine.input.pointers.primary.on( // @ts-ignore: I use a correct type of `handler` . Excalibur.js type definition is wrong?
      "down",
      (_event: Events.pointerdown): void => {
        engine.goToScene("scene2");
      }
    );
  }
}
