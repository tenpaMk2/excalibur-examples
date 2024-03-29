import {
  Scene,
  Engine,
  Random,
  CollisionGroupManager,
  CollisionStartEvent,
  Timer,
  PreKillEvent,
  Vector,
  PostKillEvent,
} from "excalibur";
import { Base } from "../objects/base";
import { Missile } from "../objects/missile";
import { Enemy } from "../objects/enemy";
import { Cloud } from "../objects/cloud";
import { config } from "../config";
import { Sky } from "../objects/sky";
import { Lockon } from "../objects/lockon";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class GameScene extends Scene {
  private rnd: Random;
  private base!: Base;
  private enemies: Enemy[];
  private lockons: Lockon[];

  constructor() {
    super();
    this.rnd = new Random(1145141919);
    this.enemies = [];
    this.lockons = [];
  }

  onInitialize = (engine: Engine) => {
    // Create collision groups for the game
    CollisionGroupManager.create("friend");
    CollisionGroupManager.create("enemy");

    new Sky(engine);

    this.base = new Base(
      engine.halfDrawWidth,
      (engine.drawHeight * 19) / 20,
      engine.drawHeight / 20,
    );
    engine.add(this.base);

    const timer = new Timer({
      fcn: () => {
        this.enemies.push(this.generateEnemy(engine, this.base));
      },
      repeats: true,
      interval: 1000,
    });
    this.add(timer);
    timer.start();

    this.generateClouds(engine);

    engine.input.pointers.primary.on("up", (_event: PointerEvent) => {
      const unlaunchedLockons = this.lockons.filter(
        (lockon) => !lockon.islaunched,
      );
      if (unlaunchedLockons.length === 0) return;

      unlaunchedLockons.forEach((lockon) => {
        this.generateMissile(engine, lockon);
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

  generateEnemy = (engine: Engine, target: Base) => {
    const x = this.rnd.floating(1, engine.drawWidth);
    const y = -config.enemyLength / 2;

    const enemy = new Enemy(engine, x, y, target.pos);
    engine.add(enemy);

    enemy.on("lockon", (_event: any) => {
      this.generateLockon(engine, enemy);
    });
    enemy.on("collisionstart", (event: CollisionStartEvent) => {
      if (event.other !== target) return;
      // target.hit();
      enemy.kill();
    });
    enemy.on("prekill", (_event: PreKillEvent) => {
      this.enemies = this.enemies.filter((enemy) => !enemy.isKilled());
    });

    return enemy;
  };

  generateLockon = (engine: Engine, enemy: Enemy) => {
    const lockon = new Lockon(enemy.pos);
    engine.add(lockon);
    this.lockons.push(lockon);

    lockon.on("prekill", (_event: PreKillEvent) => {
      this.lockons = this.lockons.filter((lockon) => !lockon.isKilled());
      enemy.cancelLockOn();
    });
    enemy.on("prekill", (_event: PreKillEvent) => {
      lockon.kill();
    });
  };

  generateMissile = (engine: Engine, target: Lockon): Missile => {
    const missile = new Missile(
      this.base.pos,
      Vector.fromAngle(this.rnd.floating(-Math.PI, 0)).scale(
        config.missileInitialSpeed,
      ),
      target.pos,
    );
    engine.add(missile);
    target.islaunched = true;

    missile.on("postKill", (_event: PostKillEvent) => {
      if (target.isKilled()) return;
      target.kill();
    });
    target.on("postKill", (_event: PostKillEvent) => {
      if (missile.isKilled()) return;
      missile.kill();
    });

    return missile;
  };
}
