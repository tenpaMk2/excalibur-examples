import { Actor, CollisionType, Color, Engine, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import config from "../config";
import { ResourceManager } from "./resource-manager";

export class Ball extends Actor {
  private startPos: Vector = Vector.Zero;
  private bracingPos: Vector = Vector.Zero;
  private canBrace: boolean = false;

  constructor(x: number, y: number, radius: number) {
    super({
      x: x,
      y: y,
      radius: radius,
      color: Color.Orange,
      collisionType: CollisionType.Active,
    });
    this.body.useGravity = false;

    const sprite = ResourceManager.getBallSprite(radius * 2);
    this.graphics.use(sprite);
  }

  onInitialize(engine: Engine) {
    this.body.mass = config.ballMass;

    this.on("pointerdown", (event: PointerEvent) => {
      this.startPos = event.worldPos;
      this.vel = Vector.Zero;
      this.body.useGravity = false;

      engine.input.pointers.primary.on("move", (event: PointerEvent) => {
        this.pos = event.worldPos;
      });

      engine.input.pointers.primary.once("up", (event: PointerEvent) => {
        this.vel = Vector.Zero;
        this.body.useGravity = true;
        this.bracingPos = event.worldPos;

        engine.input.pointers.primary.off("move");

        this.canBrace = true;
      });
    });
  }

  onPreUpdate(_engine: Engine, _delta: number): void {
    if (!this.canBrace) return;

    this.acc = this.startPos.sub(this.pos).scale(100);

    if (
      this.bracingPos.sub(this.startPos).dot(this.pos.sub(this.startPos)) < 0
    ) {
      this.body.acc = Vector.Zero;
      this.canBrace = false;
    }
  }
}
