import {
  Actor,
  CollisionType,
  Color,
  RotationType,
  SpriteSheet,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import config from "../config";
import { Resources } from "../resource";

export class Spin extends Actor {
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
      image: Resources.JK01,
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
      this.actions.clearActions();
      this.actions
        .rotateTo(Math.PI * 2, 20, RotationType.Clockwise)
        .rotateTo(Math.PI * 2, 20, RotationType.Clockwise);
    });
  };
}
