import { Actor, SpriteSheet, Vector } from "excalibur";
import { Resources } from "../resource";

export class Original extends Actor {
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
}
