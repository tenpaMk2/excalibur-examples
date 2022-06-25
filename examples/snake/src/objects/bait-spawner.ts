import { Engine, Random } from "excalibur";
import config from "../config";
import { Bait } from "./bait";
import { Grid } from "./grid";
import { Snake } from "./snake";

export class BaitSpawner {
  private rnd;

  constructor(
    private engine: Engine,
    private grid: Grid,
    private snake: Snake
  ) {
    this.rnd = new Random();
  }

  spawn() {
    const col = this.rnd.integer(0, config.gameCol - 1);
    const row = this.rnd.integer(0, config.gameRow - 1);
    const centerPos = this.grid.getCenterOfTile(col, row);

    const bait = new Bait(centerPos, this.snake, this.engine, this);
    this.engine.add(bait);
  }
}
