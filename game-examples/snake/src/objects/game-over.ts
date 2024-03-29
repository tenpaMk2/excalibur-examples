import {
  CollisionType,
  Color,
  Engine,
  Font,
  Label,
  ScreenElement,
  TextAlign,
  Vector,
} from "excalibur";
import { config } from "../config";

export class GameOver extends ScreenElement {
  private gameOverText!: Label;

  constructor() {
    super({
      pos: Vector.Zero,
      width: config.gameWidth,
      height: config.gameHeight,
      collisionType: CollisionType.PreventCollision,
      color: Color.Magenta,
    });
  }

  onInitialize(engine: Engine): void {
    this.graphics.opacity = 0.5;

    this.gameOverText = new Label({
      text: "GameOver",
      color: Color.White,
      x: engine.halfDrawWidth,
      y: engine.halfDrawHeight,
      font: new Font({
        textAlign: TextAlign.Center,
        size: config.gameOverTextSize,
      }),
      z: config.screenZ,
    });
    engine.add(this.gameOverText);
    this.addChild(this.gameOverText);

    this.z = config.screenZ;
  }
}
