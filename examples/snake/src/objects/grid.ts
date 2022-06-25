// reference-src: https://github.com/excaliburjs/sample-grid/blob/main/src/dirt-grid.ts

import {
  CollisionType,
  Engine,
  Sprite,
  SpriteSheet,
  Tile,
  TileMap,
  Vector,
} from "excalibur";
import config from "../config";
import { Resources } from "../resource";

export class Grid {
  private background!: TileMap;
  private foreground!: TileMap;

  constructor(engine: Engine) {
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
    const grasslandSprite = mapchipSpriteSheet.getSprite(5, 0)!;
    grasslandSprite.width = config.TileWidth;
    grasslandSprite.height = config.TileWidth;
    const upTreeSprite = mapchipSpriteSheet.getSprite(16, 10)!;
    upTreeSprite.width = config.TileWidth;
    upTreeSprite.height = config.TileWidth;
    const downTreeSprite = mapchipSpriteSheet.getSprite(16, 11)!;
    downTreeSprite.width = config.TileWidth;
    downTreeSprite.height = config.TileWidth;

    const tileMapConfig = {
      pos: Vector.Zero,
      rows: config.gameRow,
      columns: config.gameCol,
      tileWidth: config.TileWidth,
      tileHeight: config.TileWidth,
      collisionType: CollisionType.PreventCollision,
    };
    this.background = new TileMap(tileMapConfig);
    this.foreground = new TileMap(tileMapConfig);

    this.initBackground(grasslandSprite);

    engine.add(this.background);
    engine.add(this.foreground);
  }

  private initBackground(sprite: Sprite) {
    this.background.tiles.forEach((tile: Tile) => {
      tile.addGraphic(sprite);
    });
  }

  getCenterOfTile(col: number, row: number): Vector {
    const tile = this.background.getTile(col, row);
    return tile.center;
  }
}
