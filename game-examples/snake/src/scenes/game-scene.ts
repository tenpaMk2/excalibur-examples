import { Engine, Scene } from "excalibur";
import { BaitSpawner } from "../objects/bait-spawner";
import { Grid } from "../objects/grid";
import { Snake } from "../objects/snake";
import { TapArea } from "../objects/tap-area";

export class GameScene extends Scene {
  private grid!: Grid;
  private snake!: Snake;
  private tapArea!: TapArea;
  private baitSpawner!: BaitSpawner;

  onInitialize(_engine: Engine): void {
    this.grid = new Grid(_engine);
    this.snake = new Snake(this.grid.getCenterOfTile(3, 7), _engine);
    this.tapArea = new TapArea(_engine);
    _engine.add(this.tapArea);
    this.baitSpawner = new BaitSpawner(_engine, this.grid, this.snake);

    this.tapArea.registerTapDownCallBack(this.snake.turn);

    this.baitSpawner.spawn();
  }
}
