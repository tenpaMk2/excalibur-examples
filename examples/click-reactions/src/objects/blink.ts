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

export class Blinker extends Actor {
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
      image: Resources.JK12,
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
      this.actions.blink(100, 100, 5);
    });
  };
}
