import { Actor, CollisionType, Color, Engine, Random, Vector } from "excalibur";

export class Clock extends Actor {
  shaft: Actor;
  isCurrentClock: boolean = false;
  targetScale: number;

  constructor(x: number, y: number, scale: number) {
    super({
      x: x,
      y: y,
      collisionType: CollisionType.Passive,
      radius: 200,
      color: Color.Gray,
    });
    this.targetScale = scale;
  }

  onInitialize = (engine: Engine) => {
    this.createHourMarkers(engine);
    this.createTimeHand(engine);

    this.scale = new Vector(this.targetScale, this.targetScale);
  };

  createHourMarkers = (engine: Engine) => {
    for (let hour = 0; hour < 12; hour++) {
      // const x = 150 * Math.cos((Math.PI * 0) / 6 - Math.PI / 2);
      const angle = (Math.PI * hour) / 6 - Math.PI / 2;
      const pos = Vector.fromAngle(angle).scale(150);
      const child = new Actor({
        pos: pos,
        rotation: angle + Math.PI / 2,
        width: 10,
        height: 50,
        color: Color.Black,
        collisionType: CollisionType.PreventCollision,
      });
      this.addChild(child);
      engine.add(child);
    }
  };

  createTimeHand = (engine: Engine) => {
    this.shaft = new Actor({
      x: 0,
      y: 0,
      collisionType: CollisionType.PreventCollision,
    });
    this.addChild(this.shaft);
    engine.add(this.shaft);

    const timeHand = new Actor({
      x: 0,
      y: -60,
      width: 20,
      height: 120,
      color: Color.Rose,
      collisionType: CollisionType.PreventCollision,
    });
    this.shaft.addChild(timeHand);
    engine.add(timeHand);

    this.shaft.angularVelocity = new Random().next() * 5 + 3;
  };

  get timehandRotation() {
    return this.shaft.rotation;
  }

  setCurrentClock = () => {
    this.isCurrentClock = true;
    this.color = Color.White;
  };
}
