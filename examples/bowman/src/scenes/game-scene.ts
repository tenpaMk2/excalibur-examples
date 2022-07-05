import {
  BaseAlign,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
  Font,
  Scene,
  ScreenElement,
  Text,
} from "excalibur";
import { Bowman } from "../objects/bowman";
import { BracingEvent } from "../objects/bracing-event";
import { EnemySpawner } from "../objects/enemy-spawner";
import { Ground } from "../objects/ground";
import { TapUI } from "../objects/tap-ui";

export class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    CollisionGroupManager.create("bowman");
    CollisionGroupManager.create("enemy");

    const ground = new Ground(
      engine.halfDrawWidth,
      engine.drawHeight,
      engine.drawWidth,
      60
    );
    engine.add(ground);

    const bowman = new Bowman(
      engine,
      engine.drawWidth * 0.1,
      ground.pos.y - ground.height / 2 - 16
    );
    engine.add(bowman);

    const tapUI = new TapUI(engine);

    // @ts-ignore
    tapUI.eventPubSuber.on("brace", (event: BracingEvent) => {
      bowman.shoot(event.power * 3, event.angle);
    });

    const enemySpawner = new EnemySpawner(engine);

    this.generateTempCredits(engine);
  }

  private generateTempCredits(engine: Engine) {
    const text = new Text({
      text: "<Credits>Player graphic -> sylvius fischer, Bow and arrow graphic -> SCaydi, Enemy graphic -> kenney",
      font: new Font({
        size: 18,
        baseAlign: BaseAlign.Top,
      }),
      color: Color.White,
    });
    const tempCredits = new ScreenElement({
      x: 0,
      y: engine.drawHeight - 22,
      collisionType: CollisionType.PreventCollision,
    });
    engine.add(tempCredits);
    tempCredits.graphics.use(text);
}
