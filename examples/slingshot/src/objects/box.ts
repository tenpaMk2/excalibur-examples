import { Actor, CollisionType, Color, SpriteSheet } from "excalibur";
import { Resources } from "../resource";

export class Box extends Actor {
  constructor(x: number, y: number, length: number) {
    super({
      x: x,
      y: y,
      width: length,
      height: length,
      color: Color.Vermilion,
      collisionType: CollisionType.Active,
    });
    this.initGraphics(length);
  }

  initGraphics = (length: number) => {
    const mapchipSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.mapchip,
      grid: {
        rows: 31,
        columns: 57,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
      },
    });

    const sprite = mapchipSpriteSheet.getSprite(43, 12);
    if (!sprite) return;
    sprite.width = length;
    sprite.height = length;
    this.graphics.use(sprite);
  };
}
