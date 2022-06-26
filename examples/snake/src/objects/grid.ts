// reference-src: https://github.com/excaliburjs/sample-grid/blob/main/src/dirt-grid.ts

import {
  CollisionType,
  Engine,
  SpriteSheet,
  Tile,
  TileMap,
  Vector,
} from "excalibur";
import config from "../config";
import { Resources } from "../resource";

export class Grid {
  private background!: TileMap;
  private downTreeMap!: TileMap;
  private upTreeMap!: TileMap;

  constructor(engine: Engine) {
    const tileMapConfig = {
      pos: Vector.Zero,
      rows: config.gameRow,
      columns: config.gameCol,
      tileWidth: config.TileWidth,
      tileHeight: config.TileWidth,
      collisionType: CollisionType.PreventCollision,
    };
    this.background = new TileMap(tileMapConfig);
    this.downTreeMap = new TileMap(tileMapConfig);
    this.upTreeMap = new TileMap(tileMapConfig);

    this.initBackground();
    this.initForeground();

    engine.add(this.background);
    engine.add(this.downTreeMap);
    engine.add(this.upTreeMap);
  }

  private generateSpriteSheet(): SpriteSheet {
    return SpriteSheet.fromImageSource({
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
  }

  private initBackground() {
    const spriteSheet = this.generateSpriteSheet();
    const sprite = spriteSheet.getSprite(5, 0)!;
    sprite.width = config.TileWidth;
    sprite.height = config.TileWidth;

    this.background.tiles.forEach((tile: Tile) => {
      tile.addGraphic(sprite);
    });
  }

  private initForeground() {
    const spriteSheet = this.generateSpriteSheet();
    const upSprite = spriteSheet.getSprite(16, 10)!;
    upSprite.width = config.TileWidth;
    upSprite.height = config.TileWidth;
    const downSprite = spriteSheet.getSprite(16, 11)!;
    downSprite.width = config.TileWidth;
    downSprite.height = config.TileWidth;

    for (let row = 0; row < config.gameRow; row++) {
      for (let col = 0; col < config.gameCol; col++) {
        if (
          row === 0 ||
          row === config.gameRow - 1 ||
          col === 0 ||
          col === config.gameCol - 1
        ) {
          // plant downTree.
          const downTile = this.downTreeMap.getTile(col, row)!;
          downTile.addGraphic(downSprite);

          // setup colllider
          downTile.solid = true;

          // plant upTree
          const upTile = this.upTreeMap.getTile(col, row - 1);
          if (!upTile) continue;
          upTile.addGraphic(upSprite);
        }
      }
    }

    this.upTreeMap.z = config.upTreeZ;
  }

  getCenterOfTile(col: number, row: number): Vector {
    const tile = this.background.getTile(col, row);
    return tile.center;
  }
}
