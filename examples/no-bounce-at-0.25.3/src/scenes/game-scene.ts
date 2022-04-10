import { Scene, Engine, Actor, Color, CollisionType, Vector } from "excalibur";

export class GameScene extends Scene {
  onInitialize = (engine: Engine) => {
    const wall = new Actor({
      x: engine.drawWidth,
      y: engine.halfDrawHeight,
      width: engine.drawWidth / 20,
      height: engine.drawHeight,
      color: Color.Yellow,
      collisionType: CollisionType.Fixed,
    });
    engine.add(wall);
    wall.body.bounciness = 0.5;

    const ball = new Actor({
      x: engine.drawWidth / 10,
      y: engine.halfDrawHeight,
      radius: engine.drawWidth / 10,
      color: Color.Rose,
      collisionType: CollisionType.Active,
      vel: new Vector(800, 0),
    });
    engine.add(ball);
    ball.body.bounciness = 0.5;
  };
}
