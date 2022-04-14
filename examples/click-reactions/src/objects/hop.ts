import {
  Actor,
  CollisionType,
  Color,
  EasingFunctions,
  SpriteSheet,
  Vector,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import config from "../config";
import { Resources } from "../resource";

export class Hop extends Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: config.length,
      height: config.length,
      color: Color.Orange,
      collisionType: CollisionType.PreventCollision,
    });

    this.initGraphics();
    this.initAnimations();
  }

  initGraphics = () => {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.JK04,
      grid: {
        rows: 4,
        columns: 3,
        spriteWidth: 32,
        spriteHeight: 32,
      },
    });
    const sprite = spriteSheet.getSprite(1, 0);
    if (!sprite) return;
    sprite.width = config.length;
    sprite.height = config.length;

    this.graphics.use(sprite);
  };

  initAnimations = () => {
    this.on("pointerdown", (event: PointerEvent) => {
      this.actions.repeat((repeatContext) => {
        repeatContext
          .easeTo(
            this.pos.add(Vector.Up.scale(100)),
            100,
            EasingFunctions.EaseOutQuad
          )
          .easeTo(this.pos, 100, EasingFunctions.EaseInQuad);
      }, 2);
    });
  };
}
