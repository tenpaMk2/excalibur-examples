import {
  Scene,
  Engine,
  Random,
  CollisionGroupManager,
  CollisionStartEvent,
  Timer,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Base } from "../objects/base";
import { Missile } from "../objects/missile";
import { Enemy } from "../objects/enemy";
import { Cloud } from "../objects/cloud";
import config from "../config";
import { Sky } from "../objects/sky";

export class GameScene extends Scene {
  private rnd: Random;
  private base!: Base;
  private enemies: Enemy[];

  constructor() {
    super();
    this.rnd = new Random(1145141919);
    this.enemies = [];
  }

  onInitialize = (engine: Engine) => {
    // Create collision groups for the game
    CollisionGroupManager.create("friend");
    CollisionGroupManager.create("enemy");

    new Sky(engine);

    this.base = new Base(
      engine.halfDrawWidth,
      (engine.drawHeight * 19) / 20,
      engine.drawHeight / 20
    );
    engine.add(this.base);

    const timer = new Timer({
      fcn: () => {
        this.enemies.push(this.generateEnemy(engine));
      },
      repeats: true,
      interval: 1000,
    });
    this.add(timer);
    timer.start();

    this.generateClouds(engine);

    engine.input.pointers.primary.on("up", (event: PointerEvent) => {
      const lockedOnEnemies = this.enemies.filter((enemy) => enemy.isLockOn);
      if (lockedOnEnemies.length === 0) return;

      lockedOnEnemies.forEach((enemy) => {
        this.generateMissile(engine, enemy);
      });
    });
  };

  generateClouds = (engine: Engine) => {
    engine.clock.schedule(() => {
      const cloud = new Cloud((engine.drawHeight * 1) / 20);
      engine.add(cloud);
    }, 0);

    engine.clock.schedule(() => {
      const cloud = new Cloud((engine.drawHeight * 2) / 20);
      engine.add(cloud);
    }, 4000);

    engine.clock.schedule(() => {
      const cloud = new Cloud((engine.drawHeight * 3) / 20);
      engine.add(cloud);
    }, 2000);
  };

  onPreUpdate = (engine: Engine, delta: number): void => {
    // if (this.springEnable) {
    //   this.processSpring(engine, this.base, this.startPos);
    // }
  };

  generateEnemy = (engine: Engine) => {
    const x = this.rnd.floating(1, engine.drawWidth);
    const y = -config.enemyLength / 2;

    const enemy = new Enemy(engine, x, y, this.base.pos);
    engine.add(enemy);

    return enemy;
  };

  generateMissile = (engine: Engine, target: Enemy): Missile => {
    const missile = new Missile(this.base.pos, target);
    engine.add(missile);

    missile.on("collisionstart", (event: CollisionStartEvent) => {
      event.other.kill();
      missile.kill();
      this.enemies = this.enemies.filter((enemy) => !enemy.isKilled());
    });

    return missile;
  };
}
