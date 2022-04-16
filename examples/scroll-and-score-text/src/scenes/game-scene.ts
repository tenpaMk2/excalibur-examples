import {
  Scene,
  Engine,
  Label,
  Color,
  Font,
  TextAlign,
  EasingFunctions,
  ScreenElement,
  Text,
  Actor,
  Vector,
} from "excalibur";

export class GameScene extends Scene {
  scoreText: Text;

  onInitialize = (engine: Engine) => {
    const centerText = new Text({
      text: "center is here!!",
      color: Color.White,
      font: new Font({
        size: 24,
        // textAlign: TextAlign.Center,
      }),
    });
    centerText.origin = new Vector(10000, 0); // TODO: why not work?
    const centerLabel = new Actor({
      x: engine.halfDrawWidth,
      y: engine.halfDrawHeight,
      width: centerText.width,
      height: centerText.height,
    });
    centerLabel.graphics.use(centerText);
    engine.add(centerLabel);

    const upLabel = new Label({
      x: engine.halfDrawWidth,
      y: engine.drawHeight / 4,
      width: 180,
      height: 48,
      text: "tap to scroll ↑",
      color: Color.White,
      font: new Font({
        size: 24,
        textAlign: TextAlign.Center,
      }),
    });
    engine.add(upLabel);

    this.scoreText = new Text({
      text: "score:",
      color: Color.Yellow,
      font: new Font({
        size: 48,
        textAlign: TextAlign.Center,
      }),
    });
    const score = new ScreenElement({
      x: engine.halfDrawWidth,
      y: engine.drawHeight - 100,
    });
    score.graphics.use(this.scoreText);
    engine.add(score);

    // @ts-ignore
    upLabel.on("pointerdown", (event: PointerEvent) => {
      this.camera.move(upLabel.pos, 1000, EasingFunctions.EaseInOutCubic);
    });
  };

  onPreUpdate = (engine: Engine, delta: number): void => {
    this.scoreText.text = `score: ${delta.toFixed(3)}`;
  };
}
