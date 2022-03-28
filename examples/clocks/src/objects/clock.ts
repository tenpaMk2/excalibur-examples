import {
  Actor,
  Canvas,
  CollisionType,
  Color,
  Engine,
  Random,
  Vector,
} from "excalibur";

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
      const canvasWidth = 8; // must be 2^n.
      const canvasHeight = 512; // must be 2^n.

      const canvas = new Canvas({
        cache: true,
        height: canvasHeight,
        width: canvasWidth,
        draw: (ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 72, canvasWidth, 40);
        },
      });

      canvas.origin = new Vector(canvasWidth / 2, canvasHeight / 2);
      canvas.rotation = (Math.PI * hour) / 6;

      this.graphics.show(canvas);
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
