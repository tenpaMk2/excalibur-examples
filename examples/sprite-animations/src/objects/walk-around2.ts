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
import config from "../config";
import { Resources } from "../resource";

export class WalkAround2 extends Actor {
  private animationDown: Animation;
  private animationLeft: Animation;
  private animationRight: Animation;
  private animationUp: Animation;

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

    this.animationDown = this.generateAnimation(spriteSheet, [0, 1, 2]);
    this.animationLeft = this.generateAnimation(spriteSheet, [3, 4, 5]);
    this.animationRight = this.generateAnimation(spriteSheet, [6, 7, 8]);
    this.animationUp = this.generateAnimation(spriteSheet, [9, 10, 11]);

    this.actions.repeatForever((repeatContext) => {
      const half = config.length / 2;
      const upLeft = new Vector(
        engine.halfDrawWidth + half,
        engine.halfDrawHeight + half
      );
      const downLeft = new Vector(
        engine.halfDrawWidth + half,
        engine.drawHeight - half
      );
      const downRight = new Vector(
        engine.drawWidth - half,
        engine.drawHeight - half
      );
      const upRight = new Vector(
        engine.drawWidth - half,
        engine.halfDrawHeight + half
      );

      this.pos = upLeft;

      repeatContext
        .moveTo(downLeft, config.walkingSpeed)
        .moveTo(downRight, config.walkingSpeed)
        .moveTo(upRight, config.walkingSpeed)
        .moveTo(upLeft, config.walkingSpeed);
    });
  };

  onPreUpdate = (_engine: Engine, _delta: number) => {
    const angle = this.vel.toAngle();
    if ((-Math.PI * 3) / 4 < angle && angle <= (-Math.PI * 1) / 4) {
      this.graphics.use(this.animationUp);
    } else if ((-Math.PI * 1) / 4 < angle && angle <= (Math.PI * 1) / 4) {
      this.graphics.use(this.animationRight);
    } else if ((Math.PI * 1) / 4 < angle && angle <= (Math.PI * 3) / 4) {
      this.graphics.use(this.animationDown);
    } else {
      this.graphics.use(this.animationLeft);
    }
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
      AnimationStrategy.PingPong
    );
  };
}
