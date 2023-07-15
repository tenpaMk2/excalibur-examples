import { Actor, Animation, Sprite, SpriteSheet } from "excalibur";
import { Resources } from "../resource";

export class ResourceManager extends Actor {
  static getNormalBowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 10,
        y: 12,
        width: 44,
        height: 70,
      },
    });
  }

  static getMetalBowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 66,
        y: 14,
        width: 38,
        height: 66,
      },
    });
  }

  static getHellBowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 114,
        y: 8,
        width: 48,
        height: 78,
      },
    });
  }

  static getNormalArrowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 18,
        y: 108,
        width: 10,
        height: 54,
      },
    });
  }

  static getBombArrowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 76,
        y: 106,
        width: 22,
        height: 58,
      },
    });
  }

  static getHellArrowSprite(): Sprite {
    return new Sprite({
      image: Resources.bow,
      sourceView: {
        x: 110,
        y: 100,
        width: 18,
        height: 68,
      },
    });
  }

  static getGreenEnemyAnimation(): Animation {
    const spriteSheet = ResourceManager.getEnemySpriteSheet();
    return new Animation({
      frames: [
        {
          graphic: spriteSheet.getSprite(0, 0)!,
          duration: 300,
        },
        {
          graphic: spriteSheet.getSprite(1, 0)!,
          duration: 300,
        },
      ],
    });
  }

  static getBlueEnemyAnimation(): Animation {
    const spriteSheet = ResourceManager.getEnemySpriteSheet();
    return new Animation({
      frames: [
        {
          graphic: spriteSheet.getSprite(2, 0)!,
          duration: 300,
        },
        {
          graphic: spriteSheet.getSprite(3, 0)!,
          duration: 300,
        },
      ],
    });
  }

  static getRedEnemyAnimation(): Animation {
    const spriteSheet = ResourceManager.getEnemySpriteSheet();
    return new Animation({
      frames: [
        {
          graphic: spriteSheet.getSprite(4, 0)!,
          duration: 300,
        },
        {
          graphic: spriteSheet.getSprite(5, 0)!,
          duration: 300,
        },
      ],
    });
  }

  static getYellowEnemyAnimation(): Animation {
    const spriteSheet = ResourceManager.getEnemySpriteSheet();
    return new Animation({
      frames: [
        {
          graphic: spriteSheet.getSprite(6, 0)!,
          duration: 300,
        },
        {
          graphic: spriteSheet.getSprite(7, 0)!,
          duration: 300,
        },
      ],
    });
  }

  static getWhiteEnemyAnimation(): Animation {
    const spriteSheet = ResourceManager.getEnemySpriteSheet();
    return new Animation({
      frames: [
        {
          graphic: spriteSheet.getSprite(0, 1)!,
          duration: 300,
        },
        {
          graphic: spriteSheet.getSprite(1, 1)!,
          duration: 300,
        },
      ],
    });
  }

  static getEnemySpriteSheet(): SpriteSheet {
    return SpriteSheet.fromImageSource({
      image: Resources.enemy,
      grid: {
        rows: 3,
        columns: 9,
        spriteWidth: 24, // pixels
        spriteHeight: 24, // pixels
      },
    });
  }
}
