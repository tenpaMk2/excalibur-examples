import {
  Actor,
  CollisionType,
  Color,
  Engine,
  Polygon,
  PolygonCollider,
  Vector,
} from "excalibur";
import { config } from "../config";

export class Ground extends Actor {
  constructor(x: number, y: number, width: number, height: number) {
    super({
      x: x,
      y: y,
      width: width,
      height: height,
      color: Color.Blue,
      collisionType: CollisionType.Fixed,
    });
  }

  onInitialize(engine: Engine): void {
    const path: Vector[] = [];
    config.path.forEach((point) => {
      path.push(new Vector(point[0], point[1]));
    });
    const mountain = new Actor({
      pos: new Vector(0, 0),
      color: Color.Yellow,
      collisionType: CollisionType.Fixed,
      collider: new PolygonCollider({
        points: path,
      }),
    });
    engine.add(mountain);
    // this.addChild(mountain);
    const graphic = new Polygon({
      points: path,
      color: Color.Yellow,
    });
    mountain.graphics.use(graphic);
    mountain.graphics.anchor = new Vector(0, 0);

    const leftPoint = config.path.map((xy) => xy[0]).sort()[0];
    const rightPoint = config.path.map((xy) => xy[1]).sort()[0];
    mountain.graphics.offset = new Vector(leftPoint, rightPoint);
  }
}
