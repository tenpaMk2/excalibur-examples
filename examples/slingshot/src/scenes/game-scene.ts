import { Scene, Engine } from "excalibur";
import { Ball } from "../objects/ball";
import { Box } from "../objects/box";
import { Ground } from "../objects/ground";

export class GameScene extends Scene {
  private ball!: Ball;

  onInitialize(engine: Engine) {
    const ground = new Ground(
      engine.halfDrawWidth,
      engine.drawHeight,
      engine.drawWidth,
      engine.drawHeight / 20,
    );
    engine.add(ground);

    this.ball = new Ball(
      engine.drawWidth / 4,
      engine.halfDrawHeight,
      engine.drawHeight / 20,
    );
    engine.add(this.ball);

    this.generateBoxes(engine);
  }

  generateBoxes(engine: Engine) {
    const offsetX = (engine.drawWidth * 3) / 4;
    const edge = engine.drawHeight / 10;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const box = new Box(offsetX + row * edge, col * edge, edge);
        engine.add(box);
      }
    }
  }
}
