import {
  Actor,
  CollisionType,
  Engine,
  PreCollisionEvent,
  Sprite,
  TileMap,
  Vector,
} from "excalibur";
import config from "../config";
import { Resources } from "../resource";

export class BlockGrid {
  constructor(engine: Engine) {
    const background = new TileMap({
      pos: Vector.Zero,
      rows: config.gameRow,
      columns: config.gameCol,
      tileWidth: config.tileWidth,
      tileHeight: config.tileHeight,
    });
    engine.add(background);

    background.tiles.forEach((tile) => {
      const backgroundGraphic = new Sprite({
        image: Resources.catColor,
        sourceView: {
          x: tile.pos.x * config.imageScale,
          y: tile.pos.y * config.imageScale,
          width: tile.width * config.imageScale,
          height: tile.height * config.imageScale,
        },
        scale: new Vector(1 / config.imageScale, 1 / config.imageScale),
      });
      tile.addGraphic(backgroundGraphic);

      const foregroundGraphic = new Sprite({
        image: Resources.catGray,
        sourceView: {
          x: tile.pos.x * config.imageScale,
          y: tile.pos.y * config.imageScale,
          width: tile.width * config.imageScale - config.foregroundTileMargin,
          height: tile.height * config.imageScale - config.foregroundTileMargin,
        },
        scale: new Vector(1 / config.imageScale, 1 / config.imageScale),
      });

      const block = new Actor({
        pos: tile.center,
        width: tile.width,
        height: tile.height,
        collisionType: CollisionType.Fixed,
      });
      engine.add(block);
      block.graphics.use(foregroundGraphic);

      block.on("precollision", (event: PreCollisionEvent): void => {
        block.kill();
      });
    });
  }
}
