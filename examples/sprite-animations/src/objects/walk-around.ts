import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionType,
  Engine,
  ImageSource,
  SpriteSheet,
  Vector,
} from "excalibur";
import { config } from "../config";
import { Resources } from "../resource";

export class WalkAround extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: config.length,
      height: config.length,
      collisionType: CollisionType.PreventCollision,
    });
  }

  onInitialize = (engine: Engine) => {
    const spriteSheet = this.generateSpriteSheet(Resources.JK12);

    const animationDown = this.generateAnimation(spriteSheet, [0, 1, 2]);
    const animationLeft = this.generateAnimation(spriteSheet, [3, 4, 5]);
    const animationRight = this.generateAnimation(spriteSheet, [6, 7, 8]);
    const animationUp = this.generateAnimation(spriteSheet, [9, 10, 11]);

    this.actions.repeatForever((repeatContext) => {
      const half = config.length / 2;
      const upLeft = new Vector(half, engine.halfDrawHeight + half);
      const downLeft = new Vector(half, engine.drawHeight - half);
      const downRight = new Vector(
        engine.halfDrawWidth - half,
        engine.drawHeight - half,
      );
      const upRight = new Vector(
        engine.halfDrawWidth - half,
        engine.halfDrawHeight + half,
      );

      this.pos = upLeft;
      this.graphics.use(animationDown);

      repeatContext
        .moveTo(downLeft, config.walkingSpeed)
        .callMethod(() => {
          this.graphics.use(animationRight);
        })
        .moveTo(downRight, config.walkingSpeed)
        .callMethod(() => {
          this.graphics.use(animationUp);
        })
        .moveTo(upRight, config.walkingSpeed)
        .callMethod(() => this.graphics.use(animationLeft))
        .moveTo(upLeft, config.walkingSpeed);
    });
  };

  generateSpriteSheet = (resource: ImageSource) => {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: resource,
      grid: {
        rows: 4,
        columns: 3,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });

    spriteSheet.sprites.forEach((sprite) => {
      sprite.width = config.length;
      sprite.height = config.length;
    });

    return spriteSheet;
  };

  generateAnimation = (spriteSheet: SpriteSheet, indices: number[]) => {
    return Animation.fromSpriteSheet(
      spriteSheet,
      indices,
      config.animationWaitMS,
      AnimationStrategy.PingPong,
    );
  };
}
