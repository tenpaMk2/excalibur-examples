import { Engine, SpriteSheet, TileMap } from "excalibur";
import { Resources } from "../resource";

export class MapBuilder extends TileMap {
  mapchipSpriteSheet: SpriteSheet;

  constructor(unitLength: number) {
    super({
      x: 0,
      y: 0,
      rows: 10,
      cols: 8,
      cellWidth: unitLength,
      cellHeight: unitLength,
    });

    this.mapchipSpriteSheet = SpriteSheet.fromImageSource({
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

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (
          row === 0 ||
          row === this.rows - 1 ||
          col === 0 ||
          col === this.cols - 1
        ) {
          this.buildBlock(row, col);
        } else {
          this.buildGrassland(row, col);
        }
      }
    }
  }

  onInitialize = (engine: Engine) => {};

  buildBlock = (row: number, col: number) => {
    const cell = this.getCell(col, row);
    const sprite = this.mapchipSpriteSheet.getSprite(6, 0);
    cell.data.set("isBlocked", true);
    sprite.width = cell.width;
    sprite.height = cell.height;
    cell.addGraphic(sprite);
  };

  buildGrassland = (row: number, col: number) => {
    const cell = this.getCell(col, row);
    const sprite = this.mapchipSpriteSheet.getSprite(5, 0);
    cell.data.set("isBlocked", false);
    sprite.width = cell.width;
    sprite.height = cell.height;
    cell.addGraphic(sprite);
  };
}
