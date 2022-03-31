import { Actor, Canvas, Logger, Vector } from "excalibur";
import config from "../config";

export class HPBar extends Actor {
  constructor(public maxHP: number) {
    super({
      pos: Vector.Down.scale(config.TileWidth / 2),
    });

    this.updateHP(maxHP);
  }

  updateHP = (newHP: number) => {
    if (this.maxHP < newHP) {
      Logger.getInstance().error("over max HP!!");
      return;
    }
    if (newHP < 0) {
      Logger.getInstance().error("HP < 0 !!");
      return;
    }

    const canvasWidth = config.TileWidth; // must be 2^n.
    const canvasHeight = config.TileWidth / 8; // must be 2^n.

    const canvas = new Canvas({
      cache: true,
      height: canvasHeight,
      width: canvasWidth,
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, (canvasWidth * newHP) / this.maxHP, canvasHeight);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
      },
    });

    canvas.origin = new Vector(canvasWidth / 2, canvasHeight / 2);

    this.graphics.show(canvas);
  };
}
