import { Canvas, Color, Engine, ScreenElement, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import config from "../config";

export class TapArea extends ScreenElement {
  private tapDownCallBack: ((direction4: Vector) => void) | null = null;

  constructor(engine: Engine) {
    super({
      pos: Vector.Zero,
      z: config.screenZ,
    });

    this.initGraphic(engine.drawWidth, engine.drawHeight);
  }

  initGraphic(maxWidth: number, maxHeight: number) {
    const canvas = new Canvas({
      cache: true,
      height: maxHeight,
      width: maxWidth,
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = "white";
        ctx.setLineDash([5, 15]);

        ctx.beginPath();
        ctx.moveTo(config.tapAreaX1, 0);
        ctx.lineTo(config.tapAreaX1, maxHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(config.tapAreaX2, 0);
        ctx.lineTo(config.tapAreaX2, maxHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, config.tapAreaY1);
        ctx.lineTo(maxWidth, config.tapAreaY1);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, config.tapAreaY2);
        ctx.lineTo(maxWidth, config.tapAreaY2);
        ctx.stroke();
      },
    });
    this.graphics.use(canvas);
  }

  onInitialize(engine: Engine) {
    this.generateSubArea(engine);
  }

  generateSubArea(engine: Engine) {
    const subAreas: ScreenElement[] = [];
    subAreas.push(
      new ScreenElement({
        name: "up",
        pos: new Vector(config.tapAreaX1, 0),
        width: config.tapAreaX2 - config.tapAreaX1,
        height: config.tapAreaY1,
        color: Color.Yellow,
        anchor: Vector.Zero,
        z: config.screenZ,
      }),
      new ScreenElement({
        name: "right",
        pos: new Vector(config.tapAreaX2, config.tapAreaY1),
        width: config.gameWidth - config.tapAreaX2,
        height: config.tapAreaY2 - config.tapAreaY1,
        color: Color.Yellow,
        anchor: Vector.Zero,
        z: config.screenZ,
      }),
      new ScreenElement({
        name: "down",
        pos: new Vector(config.tapAreaX1, config.tapAreaY2),
        width: config.tapAreaX2 - config.tapAreaX1,
        height: config.gameHeight - config.tapAreaY2,
        color: Color.Yellow,
        anchor: Vector.Zero,
        z: config.screenZ,
      }),
      new ScreenElement({
        name: "left",
        pos: new Vector(0, config.tapAreaY1),
        width: config.tapAreaX1,
        height: config.tapAreaY2 - config.tapAreaY1,
        color: Color.Yellow,
        anchor: Vector.Zero,
        z: config.screenZ,
      })
    );

    subAreas.forEach((subArea: ScreenElement) => {
      subArea.graphics.opacity = 0;

      subArea.on("pointerenter", (event: PointerEvent): void => {
        subArea.graphics.opacity = 0.2;
      });
      subArea.on("pointerleave", (event: PointerEvent): void => {
        subArea.graphics.opacity = 0;
      });
      subArea.on("pointerdown", (event: PointerEvent): void => {
        let direction4 = Vector.Zero;
        switch (subArea.name) {
          case "up":
            direction4 = Vector.Up;
            break;
          case "right":
            direction4 = Vector.Right;
            break;
          case "down":
            direction4 = Vector.Down;
            break;
          case "left":
            direction4 = Vector.Left;
            break;
          default:
            return;
        }
        if (this.tapDownCallBack) this.tapDownCallBack(direction4);
      });

      engine.add(subArea);
      this.addChild(subArea);
    });
  }

  registerTapDownCallBack(cb: (direction4: Vector) => void) {
    this.tapDownCallBack = cb;
  }
}
