import { Scene, Engine, CollisionStartEvent, Logger } from "excalibur";
import { Bullet } from "../objects/bullet";
import { Clock } from "../objects/clock";

export class GameScene extends Scene {
  clocks: Clock[];

  constructor(public engine: Engine) {
    super();

    this.clocks = [];
  }

  onInitialize = (engine: Engine) => {
    this.initStage1(engine);

    // Input
    // @ts-ignore
    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      this.shoot(engine);
    });
  };

  shoot = (engine: Engine) => {
    const currentClocks = this.clocks.filter((clock) => clock.isCurrentClock);
    if (1 < currentClocks.length) {
      Logger.getInstance().error("multiple current clocks!!");
    }
    if (currentClocks.length === 0) {
      // the bullet is flying!!
      return;
    }

    const currentClock = currentClocks[0];

    const pos = currentClock.pos;
    const angle = currentClock.timehandRotation;
    const bullet = new Bullet(pos, angle);
    currentClock.kill();
    engine.add(bullet);
    this.clocks = this.clocks.filter((clock) => !clock.isKilled());

    this.setBulletCollision(engine, bullet);
  };

  setBulletCollision = (engine: Engine, bullet: Bullet) => {
    bullet.on("collisionstart", (event: CollisionStartEvent<Clock>) => {
      if (!this.clocks.includes(event.other)) {
        return;
      }
      const hitClock = event.other;
      hitClock.setCurrentClock();
      bullet.kill();
    });
  };

  initStage1 = (engine: Engine) => {
    this.generateClock(
      engine,
      engine.halfDrawWidth,
      engine.halfDrawHeight + 200,
      0.5,
      true
    );
    this.generateClock(
      engine,
      engine.halfDrawWidth + 100,
      engine.halfDrawHeight - 200,
      0.4,
      false
    );
    this.generateClock(
      engine,
      engine.halfDrawWidth - 100,
      engine.halfDrawHeight - 300,
      0.1,
      false
    );
  };

  generateClock = (
    engine: Engine,
    x: number,
    y: number,
    scale: number,
    isCurrentClock: boolean
  ) => {
    const clock = new Clock(x, y, scale);
    if (isCurrentClock) {
      clock.setCurrentClock();
    }
    engine.add(clock);
    this.clocks.push(clock);
  };
}
