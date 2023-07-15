import { Scene, Engine } from "excalibur";
import { Blinker } from "../objects/blink";
import { Hop } from "../objects/hop";
import { Spin } from "../objects/spin";

export class GameScene extends Scene {
  onInitialize = (engine: Engine) => {
    const spin = new Spin(engine.halfDrawWidth, (engine.drawHeight * 1) / 4);
    engine.add(spin);

    const jump = new Hop(engine.halfDrawWidth, (engine.drawHeight * 2) / 4);
    engine.add(jump);

    const blinker = new Blinker(
      engine.halfDrawWidth,
      (engine.drawHeight * 3) / 4
    );
    engine.add(blinker);
  };
}
