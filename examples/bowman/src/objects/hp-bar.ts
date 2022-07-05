import { Actor, Canvas, CollisionType, Vector } from "excalibur";
import config from "../config";

export class HPBar extends Actor {
  private progress: number = 1;

  constructor(y: number) {
    super({
      y: y,
      collisionType: CollisionType.PreventCollision,
    });

    this.updateGraphic();
  }

  changeProgress(progress: number) {
    this.progress = progress;
    this.updateGraphic();
  }

  private updateGraphic() {
    const canvas = new Canvas({
      cache: true,
      height: config.HPHeight,
      width: config.HPWidth,
      draw: (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, config.HPWidth, config.HPHeight);
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, config.HPWidth * this.progress, config.HPHeight);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, config.HPWidth, config.HPHeight);
      },
    });

    canvas.origin = new Vector(config.HPWidth / 2, config.HPHeight / 2);

    this.graphics.use(canvas);
  }
}
