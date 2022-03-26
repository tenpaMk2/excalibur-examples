import { Actor, Engine, SpriteSheet, Vector } from "excalibur";
import { Resources } from "../resource";

export class Clone extends Actor {
  isOpacityIncreasing: boolean = true;
  isFreezed: boolean = false;

  constructor(x: number, y: number, opacity: number) {
    super({
      x: x,
      y: y,
    });

    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.pipo,
      grid: {
        rows: 249,
        columns: 8,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });
    const sprite = spriteSheet.getSprite(1, 124);
    sprite.scale = new Vector(5, 5);
    this.graphics.use(sprite);

    this.graphics.opacity = opacity;
  }

  onPreUpdate = (engine: Engine, delta: number) => {
    if (this.isFreezed) return;

    if (this.graphics.opacity < 0 || 1 < this.graphics.opacity) {
      this.isOpacityIncreasing = !this.isOpacityIncreasing;
    }

    if (this.isOpacityIncreasing) {
      this.graphics.opacity += 0.01;
    } else {
      this.graphics.opacity -= 0.01;
    }
  };
}
