import { SpriteSheet } from "excalibur";
import config from "../config";
import { Resources } from "../resource";

export class ResourceManager {
  static getJK01Sprite() {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.JK01,
      grid: {
        rows: 4,
        columns: 3,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });
    const sprite = spriteSheet.getSprite(1, 0)!;
    sprite.width = config.edgeLength;
    sprite.height = config.edgeLength;
    return sprite;
  }

  static getJK04Sprite() {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.JK04,
      grid: {
        rows: 4,
        columns: 3,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });
    const sprite = spriteSheet.getSprite(1, 0)!;
    sprite.width = config.edgeLength;
    sprite.height = config.edgeLength;
    return sprite;
  }

  static getJK12Sprite() {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.JK12,
      grid: {
        rows: 4,
        columns: 3,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });
    const sprite = spriteSheet.getSprite(1, 0)!;
    sprite.width = config.edgeLength;
    sprite.height = config.edgeLength;
    return sprite;
  }
}
