import {
  Actor,
  CollisionType,
  Color,
  Engine,
  Random,
  Timer,
  Vector,
} from "excalibur";
export class Ball extends Actor {
  constructor(pos: Vector, radius: number, public initialSpeed: number = 300) {
    super({
      pos: pos,
      color: Color.Red,
      radius: radius,
      collisionType: CollisionType.Passive,
    });
  }

  onInitialize = (engine: Engine) => {
    this.on("exitviewport", (evt) => {
      this.kill();
    });

    const timer = new Timer({
      fcn: () => {
        const rand = new Random();
        const r = rand.floating(Math.PI * 0.25, Math.PI * 0.75);
        const x = Math.cos(r) * this.initialSpeed;
        const y = Math.sin(r) * this.initialSpeed;
        this.vel.x = x;
        this.vel.y = y;
      },
      interval: 1000,
      repeats: false,
    });
    engine.add(timer);
    timer.start();
  };

  onPostUpdate = (engine: Engine) => {
    if (this.pos.x < this.width / 2) {
      this.vel.x *= -1;
    }
    if (this.pos.x + this.width / 2 > engine.drawWidth) {
      this.vel.x *= -1;
    }
    if (this.pos.y < this.height / 2) {
      this.vel.y *= -1;
    }
  };
}
