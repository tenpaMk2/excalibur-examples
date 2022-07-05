import {
  Actor,
  Animation,
  CollisionGroupManager,
  CollisionStartEvent,
  CollisionType,
  Engine,
  ExitViewPortEvent,
  SpriteSheet,
  Vector,
} from "excalibur";
import config from "../config";
import { Resources } from "../resource";
import { Arrow } from "./arrow";
import { Ground } from "./ground";
import { HPBar } from "./hp-bar";

export class Enemy extends Actor {
  static maxHP = 1000;
  HP: number = Enemy.maxHP;
  isWalking: boolean = false;

  constructor(private engine: Engine, x: number, y: number) {
    const animation = Enemy.generateAnimation();
    super({
      x: x,
      y: y,
      width: animation.width,
      height: animation.height,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("enemy"),
      anchor: new Vector(0.5, 1),
    });

    this.graphics.use(animation);
  }

  private static generateAnimation(): Animation {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.enemy,
      grid: {
        rows: 3,
        columns: 9,
        spriteWidth: 24, // pixels
        spriteHeight: 24, // pixels
      },
    });

    return new Animation({
      frames: [
        {
          graphic: spriteSheet.getSprite(0, 0)!,
          duration: 300,
        },
        {
          graphic: spriteSheet.getSprite(1, 0)!,
          duration: 300,
        },
      ],
    });
  }

  onInitialize(engine: Engine) {
    const hpBar = new HPBar(this.height / 2 + 1);
    engine.add(hpBar);
    this.addChild(hpBar);

    this.on("collisionstart", (event: CollisionStartEvent<Actor>) => {
      if (event.other instanceof Ground) {
        this.isWalking = true;
        this.body.collisionType = CollisionType.Fixed;
        this.planWalking();
        return;
      }

      if (event.other instanceof Arrow) {
        this.HP -= 300;

        if (this.HP < 0) {
          this.kill();
        } else {
          hpBar.changeProgress(this.HP / Enemy.maxHP);
        }
      }
    });

    this.on("exitviewport", (event: ExitViewPortEvent) => {
      this.kill();
    });
  }

  onPreUpdate(engine: Engine, delta: number) {
    if (!this.isWalking) return;
    this.rotation = 0;
  }

  planWalking() {
    this.actions.repeat((ctx) => {
      config.path.forEach((point) => {
        this.actions.moveTo(point[0], point[1], config.enemySpeed1);
      });
      this.actions.moveTo(new Vector(-100, 510), config.enemySpeed1);
    }, 0);
  }
}
