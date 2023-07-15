import { Engine, Random, Timer } from "excalibur";
import { config } from "../config";
import { Enemy, EnemyType } from "./enemy";

export class EnemySpawner {
  constructor(
    private engine: Engine,
    private rnd: Random,
  ) {
    this.spawn();

    const timer = new Timer({
      fcn: () => {
        this.spawn();
      },
      repeats: true,
      interval: config.enemySpawnRate1,
    });
    engine.add(timer);
    timer.start();
  }

  spawn() {
    const enemyType: EnemyType = this.rnd.pickOne([
      "green",
      "blue",
      "red",
      "yellow",
      "white",
    ]);
    const enemy = new Enemy(
      this.engine,
      this.engine.drawWidth * 0.95,
      0,
      enemyType,
    );
    this.engine.add(enemy);
  }
}
