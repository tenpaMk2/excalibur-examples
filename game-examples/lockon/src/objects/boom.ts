import {
  Actor,
  CollisionType,
  EmitterType,
  Engine,
  ParticleEmitter,
  Vector,
} from "excalibur";
import { boomSprite } from "../resources";

export class Boom extends Actor {
  constructor(private engine: Engine, pos: Vector) {
    super({
      pos: pos,
      collisionType: CollisionType.PreventCollision,
    });

    this.initGraphics();
    this.initEmitter();

    engine.add(this);
  }

  initGraphics = () => {
    const sprite = boomSprite;
    sprite.width = 100;
    sprite.height = 100;
    this.graphics.use(sprite);
  };

  initEmitter = () => {
    const emitter = new ParticleEmitter({
      emitterType: EmitterType.Circle,
      radius: 10,
      minVel: 40,
      maxVel: 240,
      minAngle: 0,
      maxAngle: Math.PI * 2,
      emitRate: 10, // 300 particles/second
      opacity: 1,
      fadeFlag: true, // fade particles overtime
      particleLife: 500, // in milliseconds = 1 sec
      maxSize: 20, // in pixels
      minSize: 5,
      isEmitting: true, // should the emitter be emitting
      pos: this.pos.add(new Vector(this.width / 2, this.height / 2)),
    });
    this.addChild(emitter);
    this.engine.add(emitter);
  };

  onInitialize = (_engine: Engine) => {
    this.actions
      .scaleTo(new Vector(1.5, 1.5), new Vector(10, 10))
      .blink(30, 30, 10)
      .callMethod(() => {
        this.kill();
      });
  };

  onPreUpdate = (_engine: Engine, _delta: number) => {
    const globalRotation = this.getGlobalRotation();
    this.rotation -= globalRotation;
  };
}
