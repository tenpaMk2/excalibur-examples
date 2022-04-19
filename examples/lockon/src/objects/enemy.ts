import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
  Scene,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import config from "../config";
import { enemyAnimation, Resources } from "../resources";
import { Boom } from "./boom";
import { Lockon } from "./lockon";

export class Enemy extends Actor {
  public isLockOn: Boolean = false;

  constructor(private engine: Engine, x: number, y: number) {
    super({
      x: x,
      y: y,
      radius: config.enemyLength / 2.2,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("enemy"),
    });

    this.initGraphics();
  }

  onInitialize = (engine: Engine) => {
    this.on("pointerdragenter", (event: PointerEvent) => {
      this.lockOn();
    });
    this.on("pointerdown", (event: PointerEvent) => {
      this.lockOn();
    });
  };

  onPreUpdate = (engine: Engine, delta: number) => {
    this.rotation = this.vel.toAngle();
  };

  initGraphics = () => {
    this.graphics.use(enemyAnimation);
  };

  lockOn = () => {
    this.isLockOn = true;
    this.graphics.opacity -= 0.1;

    this.off("pointerdragenter");
    this.off("pointerdown");

    const lockon = new Lockon();
    this.addChild(lockon);
    this.engine.add(lockon);
  };

  onPreKill = (scene: Scene) => {
    const boom = new Boom(this.engine, this.pos);
  };
}
