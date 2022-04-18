import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
  Vector,
} from "excalibur";
import { missileAnimation } from "../resources";

export class Missile extends Actor {
  fuga = 123;
  constructor(pos: Vector, private target: Actor) {
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
  };

  onPreUpdate = (engine: Engine, delta: number) => {
    this.acc = this.target.pos.sub(this.pos);
    this.acc.size = 3000;

    this.rotation = this.acc.toAngle();
  };

  initGraphics = () => {
    this.graphics.use(missileAnimation);
  };
}
