import { Scene, Engine, Random, KillEvent } from "excalibur";
import { config } from "../config";
import { Ball } from "../objects/ball";
import { Ground } from "../objects/ground";

export class GameScene extends Scene {
  public rnd: Random;

  constructor(public engine: Engine) {
    super();
    this.rnd = new Random(config.randomSeed);
  }

  onInitialize(engine: Engine) {
    const ground = new Ground(engine.drawHeight);
    engine.add(ground);

    for (let i = 0; i < config.NumOfBalls; i++) {
      this.generateBall(engine);
    }
  }

  private generateBall(engine: Engine) {
    const x = this.rnd.floating(0, engine.drawWidth);
    const y = this.rnd.floating(0, engine.drawHeight / 10);
    const radius = this.rnd.floating(
      config.minBallRadius,
      config.maxBallRadius,
    );

    const ball = new Ball(x, y, radius, this.rnd);
    engine.add(ball);

    ball.on("kill", (_event: KillEvent): void => {
      this.generateBall(engine);
    });
  }
}
