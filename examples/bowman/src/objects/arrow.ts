import {
  Actor,
  CollisionGroupManager,
  CollisionStartEvent,
  CollisionType,
  Engine,
  ExitViewPortEvent,
  Timer,
  Vector,
} from "excalibur";
import { Blast } from "./blast";
import { ResourceManager } from "./resource-manager";

export type ArrowType = "Normal" | "Bomb" | "Hell";

export class Arrow extends Actor {
  rotatable: boolean = true;

  constructor(
    x: number,
    y: number,
    private power: number,
    private angle: number,
    private arrowType: ArrowType
  ) {
    let width: number;
    let height: number;

    switch (arrowType) {
      case "Normal":
        width = 10;
        height = 10;
        break;
      case "Bomb":
        width = 14;
        height = 14;
        break;
      case "Hell":
        width = 12;
        height = 12;
        break;
    }

    super({
      x: x,
      y: y,
      width: width,
      height: height,
      collisionType: CollisionType.Active,
      collisionGroup: CollisionGroupManager.groupByName("bowman"),
      anchor: new Vector(0.5, 0.0),
    });
  }

  onInitialize(engine: Engine) {
    switch (this.arrowType) {
      case "Normal":
        this.graphics.use(ResourceManager.getNormalArrowSprite());
        break;
      case "Bomb":
        this.graphics.use(ResourceManager.getBombArrowSprite());
        break;
      case "Hell":
        this.graphics.use(ResourceManager.getHellArrowSprite());
        break;

      default:
        break;
    }

    this.vel = Vector.fromAngle(this.angle).scale(this.power);

    let timer: Timer;
    if (this.arrowType === "Hell") {
      timer = new Timer({
        fcn: () => {
          const globalPos = this.getGlobalPos();
          const arrow = new Arrow(
            globalPos.x,
            globalPos.y,
            10,
            Math.PI * 0.5,
            "Normal"
          );
          engine.add(arrow);
        },
        interval: 100,
        repeats: true,
      });
      engine.add(timer);
      timer.start();
    }

    this.on("collisionstart", (event: CollisionStartEvent<Actor>) => {
      if (this.parent) return; // This avoid multiple parents when the arrow collides 2 objects at the same time.
      this.rotatable = false;

      this.vel = Vector.Zero;
      this.angularVelocity = 0;

      this.body.collisionType = CollisionType.Fixed;

      event.other.addChild(this);
      this.pos = this.pos.sub(event.other.pos);

      switch (this.arrowType) {
        case "Normal":
          engine.clock.schedule(() => {
            this.kill();
          }, 3000);
          break;
        case "Bomb":
          this.kill();
          const globalPos = this.getGlobalPos();
          const blast = new Blast(globalPos.x, globalPos.y);
          engine.add(blast);
          break;
        case "Hell":
          engine.clock.schedule(() => {
            this.kill();
          }, 3000);
          timer.cancel();
          break;
        default:
          break;
      }
    });

    this.on("exitviewport", (event: ExitViewPortEvent) => {
      if (this.pos.y < 0) return;
      this.kill();
    });
  }

  onPreUpdate(engine: Engine, delta: number) {
    if (this.rotatable) this.rotation = this.vel.toAngle() + Math.PI * 0.5;
  }
}
