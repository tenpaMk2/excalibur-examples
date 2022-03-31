import { Actor, Canvas, Logger, Vector } from "excalibur";

export class HPBar extends Actor {
  constructor(public maxHP: number, public unitLength: number) {
    super({
      pos: Vector.Down.scale(unitLength / 2),
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

    const canvasWidth = this.unitLength; // must be 2^n.
    const canvasHeight = this.unitLength / 8; // must be 2^n.

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
