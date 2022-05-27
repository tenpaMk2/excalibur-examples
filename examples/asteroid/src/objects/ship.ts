import {
  Actor,
  CollisionType,
  Color,
  Engine,
  ExitViewPortEvent,
  Polygon,
  PolygonCollider,
  Vector,
} from "excalibur";

export class Ship extends Actor {
  static readonly UNIT = 10 * 3;
  static readonly TRIANGLE_POINTS = [
    new Vector(Ship.UNIT, Ship.UNIT),
    new Vector(-Ship.UNIT, Ship.UNIT),
    new Vector(0, -Ship.UNIT),
  ];

  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      collisionType: CollisionType.Active,
      collider: new PolygonCollider({
        points: Ship.TRIANGLE_POINTS,
      }),
    });

    const triangle = new Polygon({
      points: Ship.TRIANGLE_POINTS,
      color: Color.Yellow,
    });
    this.graphics.use(triangle);
  }

  thrustForwardStart = () => {
    this.acc = Vector.fromAngle(this.rotation - Math.PI / 2).scale(100);
  };

  thrustTurnLeft = () => {
    this.angularVelocity = -Math.PI;
  };

  thrustTurnRight = () => {
    this.angularVelocity = Math.PI;
  };

  thrustEnd = () => {
    this.acc = Vector.Zero;
    this.angularVelocity = 0;
  };

  onInitialize = (engine: Engine) => {
    this.on("exitviewport", (event: ExitViewPortEvent) => {
      if (this.pos.x < 0) {
        this.pos.x = engine.drawWidth + this.collider.bounds.width / 2;
      } else if (engine.drawWidth < this.pos.x) {
        this.pos.x = -this.collider.bounds.width / 2;
      }

      if (this.pos.y < 0) {
        this.pos.y = engine.drawHeight + this.collider.bounds.height / 2;
      } else if (engine.drawHeight < this.pos.y) {
        this.pos.y = -this.collider.bounds.height / 2;
      }
    });
  };
}
