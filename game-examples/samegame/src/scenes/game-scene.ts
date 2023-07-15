import {
  Scene,
  Engine,
  Random,
  ScreenElement,
  Text,
  Font,
  Color,
} from "excalibur";
import { config } from "../config";
import { Grid } from "../objects/grid";

export class GameScene extends Scene {
  private rnd!: Random;

  onInitialize(engine: Engine) {
    this.rnd = new Random(config.randomSeed);

    const grid = new Grid(this.rnd, {
      rows: config.row,
      columns: config.column,
      tileHeight: config.tileEdgeLength,
      tileWidth: config.tileEdgeLength,
    });
    engine.add(grid);

    const credits = new ScreenElement({
      x: 0,
      y: engine.drawHeight - 24,
    });
    engine.add(credits);
    const text = new Text({
      text: "<Credits> Gem graphic: Clint Bellanger",
      font: new Font({
        color: Color.White,
        size: 24,
      }),
    });
    credits.graphics.use(text);
  }
}
