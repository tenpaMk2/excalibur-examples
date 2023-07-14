import { Actor, CollisionType, Engine, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { Resources } from "../resource";

export class Spawner {
  constructor(engine: Engine) {
    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      const sprite = Resources.heart.toSprite();
      const heart = new Actor({
        pos: event.screenPos,
        z: 1,
        width: sprite.width,
        height: sprite.height,
        collisionType: CollisionType.PreventCollision,
        scale: new Vector(0.1, 0.1),
      });
      engine.add(heart);
      heart.graphics.use(sprite);

      const startPos = event.screenPos;
      engine.input.pointers.primary.on("move", (event: PointerEvent) => {
        const distance = event.screenPos.distance(startPos);
        const factor = sprite.width / 2;
        heart.scale = new Vector(distance / factor, distance / factor);
        heart.rotation =
          event.screenPos.sub(startPos).toAngle() + Math.PI * 0.5;
      });

      engine.input.pointers.primary.once("up", (_event: PointerEvent) => {
        engine.input.pointers.primary.off("move");
      });
    });
  }
}
