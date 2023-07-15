import { Canvas, Color, Engine, ScreenElement, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { config } from "../config";

export type direction9 =
  | "up"
  | "upRight"
  | "right"
  | "downRight"
  | "down"
  | "downLeft"
  | "left"
  | "upLeft"
  | "center";
export type tapdownEvent = { direction9: direction9 };

export class TapArea extends ScreenElement {
  constructor(engine: Engine) {
    super({
      pos: Vector.Zero,
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
      }),
      new ScreenElement({
        name: "upRight",
        pos: new Vector(config.tapAreaX2, 0),
        width: config.gameWidth - config.tapAreaX2,
        height: config.tapAreaY1,
        color: Color.Yellow,
      }),
      new ScreenElement({
        name: "right",
        pos: new Vector(config.tapAreaX2, config.tapAreaY1),
        width: config.gameWidth - config.tapAreaX2,
        height: config.tapAreaY2 - config.tapAreaY1,
        color: Color.Yellow,
      }),
      new ScreenElement({
        name: "downRight",
        pos: new Vector(config.tapAreaX2, config.tapAreaY2),
        width: config.gameWidth - config.tapAreaX2,
        height: config.gameHeight - config.tapAreaY2,
        color: Color.Yellow,
      }),
      new ScreenElement({
        name: "down",
        pos: new Vector(config.tapAreaX1, config.tapAreaY2),
        width: config.tapAreaX2 - config.tapAreaX1,
        height: config.gameHeight - config.tapAreaY2,
        color: Color.Yellow,
      }),
      new ScreenElement({
        name: "downLeft",
        pos: new Vector(0, config.tapAreaY2),
        width: config.tapAreaX1,
        height: config.gameHeight - config.tapAreaY2,
        color: Color.Yellow,
      }),
      new ScreenElement({
        name: "left",
        pos: new Vector(0, config.tapAreaY1),
        width: config.tapAreaX1,
        height: config.tapAreaY2 - config.tapAreaY1,
        color: Color.Yellow,
      }),
      new ScreenElement({
        name: "upLeft",
        pos: new Vector(0, 0),
        width: config.tapAreaX1,
        height: config.tapAreaY1,
        color: Color.Yellow,
      }),
      new ScreenElement({
        name: "center",
        pos: new Vector(config.tapAreaX1, config.tapAreaY1),
        width: config.tapAreaX2 - config.tapAreaX1,
        height: config.tapAreaY2 - config.tapAreaY1,
        color: Color.Yellow,
      }),
    );

    subAreas.forEach((subArea: ScreenElement) => {
      subArea.graphics.opacity = 0;

      subArea.on("pointerenter", (_event: PointerEvent): void => {
        subArea.graphics.opacity = 0.2;
      });
      subArea.on("pointerleave", (_event: PointerEvent): void => {
        subArea.graphics.opacity = 0;
      });
      subArea.on("pointerdown", (_event: PointerEvent): void => {
        // ??? how to use events ???
        const ev: tapdownEvent = { direction9: subArea.name as direction9 };
        this.emit("tapdown", ev);
      });

      engine.add(subArea);
      this.addChild(subArea);
    });
  }
}
