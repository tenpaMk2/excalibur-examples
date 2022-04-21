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
import { missileAnimation } from "../resources";

export class Missile extends Actor {
  constructor(pos: Vector, private targetPos: Vector) {
    super({
      pos: pos,
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
    this.on("exitviewport", (event: ExitViewPortEvent) => {
      this.kill();
    });
  };

  onPreUpdate = (engine: Engine, delta: number) => {
    this.acc = this.targetPos.sub(this.pos);
    this.acc.size = 3000;

    this.rotation = this.acc.toAngle();
  };

  initGraphics = () => {
    this.graphics.use(missileAnimation);
  };
}
