import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Resources } from "../resources";

export class Enemy extends Actor {
  public isLockOn: Boolean = false;

  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      width: 100,
      height: 100,
      color: Color.Orange,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("enemy"),
    });

    this.initGraphics(100);
  }

  onInitialize = (engine: Engine) => {
    this.on("pointerdragenter", (event: PointerEvent) => {
      this.lockOn();
    });
    this.on("pointerdown", (event: PointerEvent) => {
      this.lockOn();
    });
  };

  initGraphics = (length: number) => {
    const sprite = Resources.ball.toSprite();
    sprite.width = length;
    sprite.height = length;
    this.graphics.use(sprite);
  };

  lockOn = () => {
    this.isLockOn = true;
    this.graphics.opacity -= 0.1;

    this.off("pointerdragenter");
    this.off("pointerdown");
  };
}
