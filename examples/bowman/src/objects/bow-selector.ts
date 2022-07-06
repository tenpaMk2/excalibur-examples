import { Actor, CollisionType, Color, Engine, Sprite, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { BowSelectEvent, BowType } from "./bow-select-event";
import { ResourceManager } from "./resource-manager";

export class BowSelector {
  eventPubSuber: Actor;
  bows: Actor[] = [];

  constructor(private engine: Engine) {
    this.eventPubSuber = new Actor();

    const normalBowSelector = new Actor({
      x: engine.drawWidth * 0.08,
      y: engine.drawHeight * 0.1,
      z: 1000,
      width: 60,
      height: 80,
      color: Color.Azure,
      collisionType: CollisionType.PreventCollision,
    });
    engine.add(normalBowSelector);
    this.bows.push(normalBowSelector);
    normalBowSelector.onInitialize = (engine: Engine): void => {
      normalBowSelector.graphics.show(ResourceManager.getNormalBowSprite());
      normalBowSelector.graphics.opacity = 1;

      normalBowSelector.on("pointerdown", (event: PointerEvent): void => {
        this.eventPubSuber.emit("bow-select", new BowSelectEvent("Normal"));

        this.unselectAll();
        normalBowSelector.graphics.opacity = 1;
      });
    };

    const metalBowSelector = new Actor({
      x: engine.drawWidth * 0.16,
      y: engine.drawHeight * 0.1,
      z: 1000,
      width: 60,
      height: 80,
      color: Color.Azure,
      collisionType: CollisionType.PreventCollision,
    });
    engine.add(metalBowSelector);
    this.bows.push(metalBowSelector);
    metalBowSelector.onInitialize = (engine: Engine): void => {
      metalBowSelector.graphics.show(ResourceManager.getMetalBowSprite());

      metalBowSelector.on("pointerdown", (event: PointerEvent): void => {
        this.eventPubSuber.emit("bow-select", new BowSelectEvent("Metal"));

        this.unselectAll();
        metalBowSelector.graphics.opacity = 1;
      });
    };

    const hellBowSelector = new Actor({
      x: engine.drawWidth * 0.24,
      y: engine.drawHeight * 0.1,
      z: 1000,
      width: 60,
      height: 80,
      color: Color.Azure,
      collisionType: CollisionType.PreventCollision,
    });
    engine.add(hellBowSelector);
    this.bows.push(hellBowSelector);
    hellBowSelector.onInitialize = (engine: Engine): void => {
      hellBowSelector.graphics.show(ResourceManager.getHellBowSprite());

      hellBowSelector.on("pointerdown", (event: PointerEvent): void => {
        this.eventPubSuber.emit("bow-select", new BowSelectEvent("Hell"));

        this.unselectAll();
        hellBowSelector.graphics.opacity = 1;
      });
    };

    this.unselectAll();
  }

  private unselectAll(): void {
    this.bows.forEach((bow) => {
      bow.graphics.opacity = 0.5;
    });
  }
}
