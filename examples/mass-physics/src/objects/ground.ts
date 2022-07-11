import {
  Actor,
  CollisionType,
  Color,
  Engine,
  Polygon,
  PolygonCollider,
  Vector,
} from "excalibur";
import config from "../config";

export class Ground extends Actor {
  static readonly TRIANGLE_POINTS = [
    new Vector(0, 0),
    new Vector(0, -20),
    new Vector(100, -90),
    new Vector(200, -80),
    new Vector(300, -110),
    new Vector(400, -80),
    new Vector(540, -10),
    new Vector(540, 0),
  ];

  constructor(y: number) {
    super({
      x: 0,
      y: y,
      collisionType: CollisionType.Fixed,
      collider: new PolygonCollider({
        points: Ground.TRIANGLE_POINTS,
      }).triangulate(),
    });
  }

  onInitialize(engine: Engine) {
    const triangle = new Polygon({
      points: Ground.TRIANGLE_POINTS,
      color: Color.Yellow,
    });
    this.graphics.use(triangle);
    this.graphics.anchor = new Vector(0, 1);

    this.body.bounciness = config.groundBounciness;
  }
}
