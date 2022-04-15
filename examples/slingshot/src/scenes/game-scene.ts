import { Scene, Engine, Vector, Logger } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Ball } from "../objects/ball";
import { Box } from "../objects/box";
import { Ground } from "../objects/ground";

export class GameScene extends Scene {
  private springEnable = false;
  private ball!: Ball;
  private startPos: Vector = Vector.Zero;

  onInitialize = (engine: Engine) => {
    const ground = new Ground(
      engine.halfDrawWidth,
      engine.drawHeight,
      engine.drawWidth,
      engine.drawHeight / 20
    );
    engine.add(ground);

    this.ball = new Ball(
      engine.drawWidth / 4,
      engine.halfDrawHeight,
      engine.drawHeight / 20
    );
    engine.add(this.ball);

    this.generateBoxes(engine);

    this.ball.on("pointerdown", (event: PointerEvent) => {
      this.startPos = event.worldPos;
      this.ball.body.vel = Vector.Zero;
      this.ball.body.useGravity = false;

      engine.input.pointers.primary.on("move", (event: PointerEvent) => {
        this.ball.pos = event.worldPos;
      });

      engine.input.pointers.primary.once("up", (event: PointerEvent) => {
        this.ball.body.vel = Vector.Zero;
        this.ball.body.useGravity = true;

        engine.input.pointers.primary.off("move");

        this.springEnable = true;
      });
    });
  };

  onPreUpdate = (engine: Engine, delta: number): void => {
    if (this.springEnable) {
      this.processSpring(engine, this.ball, this.startPos);
    }
  };

  processSpring = (engine: Engine, ball: Ball, startPos: Vector) => {
    ball.body.acc = startPos.sub(ball.pos).scale(100);

    if (ball.body.acc.size < 2000) {
      ball.body.acc = Vector.Zero;
      this.springEnable = false;
    }

    Logger.getInstance().info(ball.body.acc.size);
  };

  generateBoxes = (engine: Engine) => {
    const offsetX = (engine.drawWidth * 3) / 4;
    const edge = engine.drawHeight / 10;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const box = new Box(offsetX + row * edge, col * edge, edge);
        engine.add(box);
      }
    }
  };
}
