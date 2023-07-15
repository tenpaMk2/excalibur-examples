import { SpriteSheet } from "excalibur";
import { Resources } from "../resource";

export class ResourceManager {
  static getBallSprite(edgeLength: number) {
    const sprite = Resources.ball.toSprite();
    sprite.width = edgeLength;
    sprite.height = edgeLength;
    return sprite;
  }

  static getBoxSprite(edgeLength: number) {
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

    const sprite = mapchipSpriteSheet.getSprite(43, 12)!;
    sprite.width = edgeLength;
    sprite.height = edgeLength;
    return sprite;
  }
}
