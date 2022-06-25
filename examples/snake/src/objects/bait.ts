import {
  Actor,
  CollisionType,
  Engine,
  Events,
  PostKillEvent,
  SpriteSheet,
  Vector,
} from "excalibur";
import config from "../config";
import { Resources } from "../resource";
import { BaitSpawner } from "./bait-spawner";
import { Snake } from "./snake";

export class Bait extends Actor {
  constructor(
    pos: Vector,
    private snake: Snake,
    private engine: Engine,
    private baitSpawner: BaitSpawner
  ) {
    super({
      pos: pos,
      width: config.TileWidth,
      height: config.TileWidth,
      collisionType: CollisionType.Passive,
      radius: config.TileWidth / 3,
    });

    this.initGraphic();
    this.initPhysics();
  }

  private initGraphic() {
    const mapchipSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.mapchip,
      grid: {
        rows: 31,
        columns: 57,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
      },
    });

    const sprite = mapchipSpriteSheet.getSprite(41, 11);
    if (!sprite) throw new Error("cannot get sprite!!");
    sprite.width = config.TileWidth;
    sprite.height = config.TileWidth;

    this.graphics.use(sprite);
  }

  private initPhysics() {
    this.on(
      "collisionstart",
      (event: Events.CollisionStartEvent<Actor>): void => {
        if (event.other !== this.snake.getHead()) return; // head
        this.kill();
      }
    );

    this.on("postkill", (event: PostKillEvent): void => {
      this.snake.pushTail(this.engine);
      this.baitSpawner.spawn();
    });
  }
}
