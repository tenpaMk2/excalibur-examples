import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
  SpriteSheet,
  Vector,
} from "excalibur";
import { Resources } from "../resource";

export class Missile extends Actor {
  constructor(pos: Vector, private target: Actor) {
    super({
      pos: pos,
      width: 64,
      height: 32,
      color: Color.Rose,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("missile"),
    });
  }

  onInitialize = (engine: Engine) => {
    this.initGraphics();
  };

  onPreUpdate = (engine: Engine, delta: number) => {
    this.acc = this.target.pos.sub(this.pos);
    this.acc.size = 3000;

    this.rotation = this.acc.toAngle();
  };

  initGraphics = () => {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.missile,
      grid: {
        rows: 1,
        columns: 3,
        spriteHeight: 32,
        spriteWidth: 64,
      },
    });

    // spriteSheet.sprites.forEach((sprite) => {
    //   sprite.width = config.length;
    //   sprite.height = config.length;
    // });

    const animation = Animation.fromSpriteSheet(
      spriteSheet,
      [0, 1, 2],
      1000 / 60,
      AnimationStrategy.Loop
    );

    this.graphics.use(animation);
  };
}
