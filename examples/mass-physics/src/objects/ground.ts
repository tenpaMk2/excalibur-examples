import {
  Actor,
  CollisionType,
  Color,
  Engine,
  Polygon,
  PolygonCollider,
  Vector,
} from "excalibur";

export class Ground extends Actor {
  // must be CONVEX!!
  static readonly TRIANGLE_POINTS = [
    new Vector(0, 0),
    new Vector(0, -20),
    new Vector(100, -90),
    new Vector(200, -120),
    new Vector(300, -110),
    new Vector(400, -80),
    new Vector(540, -10),
    new Vector(540, 0),
  ];

  constructor() {
    super({
      x: 0,
      y: 0,
      collisionType: CollisionType.Fixed,
      collider: new PolygonCollider({
        points: Ground.TRIANGLE_POINTS,
      }),
    });

    const triangle = new Polygon({
      points: Ground.TRIANGLE_POINTS,
      color: Color.Yellow,
    });
    this.graphics.use(triangle);
    this.graphics.anchor = new Vector(0, 1);
  }

  onInitialize = (engine: Engine) => {
    this.pos.y = engine.drawHeight;
  };
}
