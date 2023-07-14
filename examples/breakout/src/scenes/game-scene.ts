import {
  Scene,
  Engine,
  Vector,
  PreCollisionEvent,
} from "excalibur";

import { Ball } from "../objects/ball";
import { BlockGrid } from "../objects/block";
import { GameOverScreen } from "../objects/gameover-screen";
import { Paddle } from "../objects/paddle";

export class GameScene extends Scene {
  ball!: Ball;
  gameOverScreen!: GameOverScreen;

  onInitialize(engine: Engine): void {
    const width = engine.drawWidth;
    const height = engine.drawHeight;

    new BlockGrid(engine);

    this.ball = new Ball(new Vector(width * 0.2, height * 0.7), height * 0.02);
    engine.add(this.ball);

    const paddle = new Paddle(
      new Vector(width * 0.5, height * 0.95),
      width * 0.15,
      height * 0.02
    );
    engine.add(paddle);

    paddle.on("precollision", (event: PreCollisionEvent) => {
      if (this.ball !== event.other) {
        return;
      }

      const velSize = this.ball.vel.size;
      this.ball.vel = this.ball.pos.sub(paddle.pos);
      this.ball.vel.size = velSize;
    });
  }
}
