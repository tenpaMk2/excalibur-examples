import { Actor, CollisionType, Color, Engine, Vector } from "excalibur";

export class Bullet extends Actor {
  lifetime = 2000;

  constructor(x: number, y: number, angle: number) {
    super({
      x: x,
      y: y,
      collisionType: CollisionType.Passive,
      width: 5,
      height: 5,
      color: Color.Yellow,
    });

    this.vel = Vector.fromAngle(angle - Math.PI / 2).scale(300);
    this.rotation = angle;
  }

  onPreUpdate = (_engine: Engine, delta: number): void => {
    this.lifetime -= delta;

    if (this.lifetime < 0) {
      this.kill();
    }
  };
}
