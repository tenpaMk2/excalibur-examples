import { Engine, Timer } from "excalibur";
import config from "../config";
import { Enemy } from "./enemy";

export class EnemySpawner {
  constructor(private engine: Engine) {
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
    const enemy = new Enemy(this.engine, this.engine.drawWidth * 0.95, 0);
    this.engine.add(enemy);
  }
}
