import { Color, Engine, Font, Label, Scene, TextAlign } from "excalibur";
import { DeathEvent } from "../objects/my-event";
import { Square } from "../objects/square";

export class GameScene extends Scene {
  onInitialize(_engine: Engine): void {
    const square = new Square(_engine.halfDrawWidth, _engine.halfDrawHeight);
    _engine.add(square);

    const label1 = new Label({
      x: _engine.halfDrawWidth,
      y: 100,
      text: "hoge",
      color: Color.White,
      font: new Font({
        textAlign: TextAlign.Center,
        size: 32,
      }),
    });
    _engine.add(label1);

    const label2 = new Label({
      x: _engine.halfDrawWidth,
      y: 400,
      text: "hoge",
      color: Color.White,
      font: new Font({
        textAlign: TextAlign.Center,
        size: 32,
      }),
    });
    _engine.add(label2);

    // @ts-ignore
    square.on("death", (event: DeathEvent) => {
      label1.text = event.stringData;
      label2.text = event.numberData.toString(2);
    });
  }
}
