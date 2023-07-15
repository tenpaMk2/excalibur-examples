import { Random, SpriteSheet } from "excalibur";
import { Resources } from "../resource";

export class ResourceManager {
  static getRandomVillagerSprite(rnd: Random, radius: number) {
    const bodySpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.chara,
      grid: {
        rows: 12,
        columns: 2,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
        originOffset: {
          x: 0,
          y: 0,
        },
      },
    });

    const sprite = bodySpriteSheet.getSprite(
      rnd.integer(0, 1),
      rnd.integer(5, 11)
    )!;
    sprite.width = radius * 2;
    sprite.height = radius * 2;
    return sprite;
  }
}
