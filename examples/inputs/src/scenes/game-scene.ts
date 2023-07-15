import { Actor, CollisionType, Color, Engine, Input, Scene } from "excalibur";
import { KeyEvent } from "excalibur/build/dist/Input/Keyboard";
import { config } from "../config";

export class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    const ground = new Actor({
      x: engine.halfDrawWidth,
      y: engine.drawHeight,
      width: engine.drawWidth,
      height: 32,
      color: Color.Yellow,
      collisionType: CollisionType.Fixed,
    });
    engine.add(ground);

    const player = new Actor({
      x: engine.halfDrawWidth,
      y: engine.drawHeight - 64,
      width: 32,
      height: 32,
      color: Color.Rose,
      collisionType: CollisionType.Active,
    });
    engine.add(player);
    player.onPreUpdate = (engine: Engine, _delta: number) => {
      if (engine.input.keyboard.isHeld(Input.Keys.Left)) {
        player.vel.x = -config.moveSpeed;
      }
      if (engine.input.keyboard.isHeld(Input.Keys.Right)) {
        player.vel.x = config.moveSpeed;
      }
      if (engine.input.keyboard.isHeld(Input.Keys.Q)) {
        player.angularVelocity = -config.moveSpeed;
      }
      if (engine.input.keyboard.isHeld(Input.Keys.E)) {
        player.angularVelocity = config.moveSpeed;
      }
    };

    engine.input.keyboard.on("press", (event: KeyEvent) => {
      if (event.key === Input.Keys.Space) player.vel.y = -config.jumpSpeed;
    });
  }
}
