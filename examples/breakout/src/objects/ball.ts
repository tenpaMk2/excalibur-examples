import {
  Actor,
  CollisionType,
  Color,
  Engine,
  PostKillEvent,
  PreCollisionEvent,
  Random,
  Side,
  Timer,
  Vector,
} from "excalibur";
import config from "../config";
import { GameOverScreen } from "./gameover-screen";
import { GameOverText } from "./gameover-text";
export class Ball extends Actor {
  constructor(pos: Vector, radius: number, private initialSpeed: number = 300) {
    super({
      pos: pos,
      color: Color.Red,
      radius: radius,
      collisionType: CollisionType.Passive,
    });
  }

  onInitialize = (engine: Engine) => {
    this.on("precollision", (event: PreCollisionEvent) => {
      switch (event.side) {
        case Side.Top:
          this.vel.y = Math.abs(this.vel.y);
          break;
        case Side.Right:
          this.vel.x = -Math.abs(this.vel.x);
          break;
        case Side.Bottom:
          this.vel.y = -Math.abs(this.vel.y);
          break;
        case Side.Left:
          this.vel.x = Math.abs(this.vel.x);
          break;
        default:
          throw Error("invalid `Side`.");
      }
    });

    this.on("exitviewport", (_evt) => {
      this.kill();
    });

    this.on("postkill", (_event: PostKillEvent): void => {
      const gameOverScreen = new GameOverScreen(
        engine.drawWidth,
        engine.drawHeight
      );
      engine.add(gameOverScreen);

      const gameOverText = new GameOverText(
        engine.halfDrawWidth,
        engine.halfDrawHeight
      );
      engine.add(gameOverText);
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
      interval: config.startTime,
      repeats: false,
    });
    engine.add(timer);
    timer.start();
  };

  onPostUpdate = (engine: Engine) => {
    if (this.pos.x < this.width / 2) {
      this.vel.x = Math.abs(this.vel.x);
    }
    if (this.pos.x + this.width / 2 > engine.drawWidth) {
      this.vel.x = -Math.abs(this.vel.x);
    }
    if (this.pos.y < this.height / 2) {
      this.vel.y = Math.abs(this.vel.y);
    }
  };
}
