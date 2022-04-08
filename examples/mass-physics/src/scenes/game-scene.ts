import { Scene, Engine, Random, ExitViewPortEvent } from "excalibur";
import config from "../config";
import { Ball } from "../objects/ball";
import { Ground } from "../objects/ground";

export class GameScene extends Scene {
  public rnd: Random;

  constructor(public engine: Engine) {
    super();
    this.rnd = new Random(1145141919);
  }

  onInitialize = (engine: Engine) => {
    const ground = new Ground();
    engine.add(ground);

    for (let i = 0; i < config.NumOfBalls; i++) {
      this.generateBall(engine);
    }
  };

  generateBall = (engine: Engine) => {
    const x = this.rnd.floating(0, engine.drawWidth);
    const y = this.rnd.floating(0, engine.drawHeight / 10);
    const radius = this.rnd.floating(
      engine.drawWidth / 40,
      engine.drawWidth / 10
    );

    const ball = new Ball(x, y, radius);
    engine.add(ball);

    ball.on("exitviewport", (event: ExitViewPortEvent) => {
      this.generateBall(engine);
      ball.kill();
    });
  };
}
