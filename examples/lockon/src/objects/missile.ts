import {
  Actor,
  CollisionGroupManager,
  CollisionStartEvent,
  CollisionType,
  Color,
  Engine,
  ExitViewPortEvent,
  Vector,
} from "excalibur";
import config from "../config";
import { missileAnimation } from "../resources";

export class Missile extends Actor {
  private allowAcc = false;

  constructor(pos: Vector, vel: Vector, private targetPos: Vector) {
    super({
      pos: pos,
      vel: vel,
      width: 64,
      height: 32,
      color: Color.Rose,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("friend"),
    });
  }

  onInitialize = (engine: Engine) => {
    this.initGraphics();

    this.on("collisionstart", (event: CollisionStartEvent) => {
      event.other.kill();
      this.kill();
    });
    this.on("exitviewport", (_event: ExitViewPortEvent) => {
      this.kill();
    });

    engine.clock.schedule(() => {
      this.allowAcc = true;
    }, config.missileLaunchTimeMS);
  };

  onPreUpdate = (_engine: Engine, _delta: number) => {
    if (!this.allowAcc) return;
    this.acc = this.targetPos.sub(this.pos);
    this.acc.size = config.missileAcc;

    this.rotation = this.acc.toAngle();
  };

  initGraphics = () => {
    this.graphics.use(missileAnimation);
  };
}
