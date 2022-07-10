import {
  Actor,
  CollisionType,
  Color,
  Engine,
  PreCollisionEvent,
  Scene,
  Side,
  Vector,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    const ground1 = new Actor({
      pos: new Vector(200, 700),
      width: 300,
      height: 200,
      color: Color.Cyan,
      collisionType: CollisionType.Fixed,
    });
    engine.add(ground1);

    const ground2 = new Actor({
      pos: new Vector(400, 400),
      width: 100,
      height: 600,
      color: Color.Magenta,
      collisionType: CollisionType.Fixed,
    });
    engine.add(ground2);

    const player = new Actor({
      x: engine.halfDrawWidth,
      y: engine.halfDrawHeight,
      width: 20,
      height: 20,
      color: Color.Chartreuse,
      collisionType: CollisionType.Active,
    });
    engine.add(player);

    player.vel = new Vector(30, 0);

    let isOnGround = false;
    player.on("precollision", (event: PreCollisionEvent): void => {
      console.log(event.side);

      if (event.side === Side.Bottom) {
        isOnGround = true;
      } else {
        isOnGround = false;
      }
    });

    engine.input.pointers.primary.on("down", (event: PointerEvent): void => {
      if (isOnGround) player.vel = player.vel.add(new Vector(0, -100)); // jump!!
    });
  }
}
