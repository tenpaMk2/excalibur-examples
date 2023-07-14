import {
  Actor,
  CollisionType,
  Color,
  Engine,
  ExitViewPortEvent,
  Polygon,
  PolygonCollider,
  Random,
  Vector,
} from "excalibur";

export class Asteroid extends Actor {
  static readonly UNIT = 10 * 5;
  static readonly SQUARE_POINTS = [
    new Vector(Asteroid.UNIT, Asteroid.UNIT),
    new Vector(-Asteroid.UNIT, Asteroid.UNIT),
    new Vector(-Asteroid.UNIT, -Asteroid.UNIT),
    new Vector(Asteroid.UNIT, -Asteroid.UNIT),
  ];
  static readonly PENTAGON_POINTS = [
    new Vector(
      Math.cos((Math.PI * 2 * 0) / 5) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 0) / 5) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 1) / 5) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 1) / 5) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 2) / 5) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 2) / 5) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 3) / 5) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 3) / 5) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 4) / 5) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 4) / 5) * Asteroid.UNIT
    ),
  ];
  static readonly HEXAGON_POINTS = [
    new Vector(
      Math.cos((Math.PI * 2 * 0) / 6) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 0) / 6) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 1) / 6) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 1) / 6) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 2) / 6) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 2) / 6) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 3) / 6) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 3) / 6) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 4) / 6) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 4) / 6) * Asteroid.UNIT
    ),
    new Vector(
      Math.cos((Math.PI * 2 * 5) / 6) * Asteroid.UNIT,
      Math.sin((Math.PI * 2 * 5) / 6) * Asteroid.UNIT
    ),
  ];

  constructor(
    x: number,
    y: number,
    public type: "square" | "pentagon" | "hexagon"
  ) {
    super({
      x: x,
      y: y,
      collisionType: CollisionType.Active,
    });

    let polygonCollider!: PolygonCollider;
    let polygon!: Polygon;
    let xOffset!: Vector;
    let scale!: number;

    switch (type) {
      case "square":
        polygonCollider = new PolygonCollider({
          points: Asteroid.SQUARE_POINTS,
        });
        polygon = new Polygon({
          points: Asteroid.SQUARE_POINTS,
          color: Color.White,
        });
        xOffset = Vector.Zero;
        scale = 1;
        break;
      case "pentagon":
        polygonCollider = new PolygonCollider({
          points: Asteroid.PENTAGON_POINTS,
        });
        polygon = new Polygon({
          points: Asteroid.PENTAGON_POINTS,
          color: Color.White,
        });
        xOffset = new Vector(5, 0); // TODO: why need?
        scale = 2;
        break;
      case "hexagon":
        polygonCollider = new PolygonCollider({
          points: Asteroid.HEXAGON_POINTS,
        });
        polygon = new Polygon({
          points: Asteroid.HEXAGON_POINTS,
          color: Color.White,
        });
        xOffset = Vector.Zero;
        scale = 3;
        break;

      default:
        break;
    }

    this.collider.set(polygonCollider);
    this.graphics.use(polygon);
    this.graphics.offset = xOffset;

    this.scale = new Vector(scale, scale);

    this.angularVelocity = (new Random().next() - 0.5) * 5;
  }

  onInitialize = (engine: Engine) => {
    this.on("exitviewport", (_event: ExitViewPortEvent) => {
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
