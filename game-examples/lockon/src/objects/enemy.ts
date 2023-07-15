import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Engine,
  ExitViewPortEvent,
  Scene,
  Vector,
} from "excalibur";
import { config } from "../config";
import { enemyAnimation } from "../resources";
import { Boom } from "./boom";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class Enemy extends Actor {
  public isLockOn: Boolean = false;

  constructor(
    private engine: Engine,
    x: number,
    y: number,
    private targetPos: Vector,
  ) {
    super({
      x: x,
      y: y,
      radius: config.enemyLength / 2.2,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("enemy"),
    });

    this.initGraphics();
  }

  onInitialize = (_engine: Engine) => {
    this.initLockOnEvent();

    this.on("exitviewport", (_event: ExitViewPortEvent) => {
      if (this.pos.y < 0) return;
      this.kill();
    });
  };

  initLockOnEvent = () => {
    this.on("pointerdragenter", (_event: PointerEvent) => {
      this.lockOn();
    });
    this.on("pointerdown", (_event: PointerEvent) => {
      this.lockOn();
    });
  };

  onPreUpdate = (_engine: Engine, _delta: number) => {
    this.rotation = this.vel.toAngle();

    this.acc.x = (this.targetPos.x - this.pos.x) * config.enemyAccXMultiplier;
    this.acc.y = -900;
  };

  initGraphics = () => {
    this.graphics.use(enemyAnimation);
  };

  lockOn = () => {
    this.isLockOn = true;

    this.off("pointerdragenter");
    this.off("pointerdown");

    this.emit("lockon", {});
  };

  cancelLockOn = () => {
    this.isLockOn = false;

    this.initLockOnEvent();
  };

  onPreKill = (_scene: Scene) => {
    new Boom(this.engine, this.pos);
  };
}
