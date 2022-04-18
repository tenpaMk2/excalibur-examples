import { Scene, Engine, Random, CollisionGroupManager } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Base } from "../objects/base";
import { Missile } from "../objects/missile";
import { Enemy } from "../objects/enemy";

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

    this.base = new Base(
      engine.halfDrawWidth,
      (engine.drawHeight * 19) / 20,
      engine.drawHeight / 20
    );
    engine.add(this.base);

    this.enemies.push(this.generateEnemy(engine));
    this.enemies.push(this.generateEnemy(engine));

    engine.input.pointers.primary.on("up", (event: PointerEvent) => {
      const lockedOnEnemies = this.enemies.filter((enemy) => enemy.isLockOn);
      if (lockedOnEnemies.length === 0) return;

      lockedOnEnemies.forEach((enemy) => {
        const missile = new Missile(this.base.pos, enemy);
        engine.add(missile);
      });
    });
  };

  onPreUpdate = (engine: Engine, delta: number): void => {
    // if (this.springEnable) {
    //   this.processSpring(engine, this.base, this.startPos);
    // }
  };

  generateEnemy = (engine: Engine) => {
    const x = this.rnd.floating(1, engine.drawWidth);
    const y =
      this.rnd.floating(-engine.drawHeight / 20, engine.drawHeight / 20) +
      (engine.drawHeight * 2) / 20;

    const enemy = new Enemy(x, y);
    engine.add(enemy);

    enemy.actions.meet(this.base, 10);

    return enemy;
  };
}
