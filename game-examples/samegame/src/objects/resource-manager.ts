import { SpriteSheet } from "excalibur";
import { Resources } from "../resource";

export const GemType = {
  Sapphire: "sapphire",
  Emerald: "emerald",
  Ruby: "ruby",
  Diamond: "diamond",
} as const;
export type GemType = typeof GemType[keyof typeof GemType];

export class ResourceManager {
  static getGemsSpriteSheet() {
    return SpriteSheet.fromImageSource({
      image: Resources.gems,
      grid: {
        rows: 3,
        columns: 2,
        spriteHeight: 32,
        spriteWidth: 32,
      },
    });
  }

  static getGemSprite(gemType: GemType, width: number, height: number) {
    const spriteSheet = ResourceManager.getGemsSpriteSheet();
    let sprite;
    switch (gemType) {
      case GemType.Sapphire:
        sprite = spriteSheet.getSprite(0, 1)!;
        break;
      case GemType.Emerald:
        sprite = spriteSheet.getSprite(1, 1)!;
        break;
      case GemType.Ruby:
        sprite = spriteSheet.getSprite(0, 2)!;
        break;
      case GemType.Diamond:
        sprite = spriteSheet.getSprite(1, 2)!;
        break;
    }

    sprite.width = width;
    sprite.height = height;
    return sprite;
  }
}
