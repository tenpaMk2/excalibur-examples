import { Engine, Sprite, SpriteSheet, TileMap, Vector } from "excalibur";
import { Resources } from "../resource";

export class MapBuilder extends TileMap {
  mapchipSpriteSheet: SpriteSheet;
  blockSprite: Sprite;
  grasslandSprite: Sprite;
  upTreeSprite: Sprite;
  downTreeSprite: Sprite;

  constructor(public unitLength: number) {
    super({
      x: 0,
      y: 0,
      rows: 10,
      cols: 16,
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

    this.blockSprite = this.mapchipSpriteSheet.getSprite(6, 0);
    this.blockSprite.width = unitLength;
    this.blockSprite.height = unitLength;
    this.grasslandSprite = this.mapchipSpriteSheet.getSprite(5, 0);
    this.grasslandSprite.width = unitLength;
    this.grasslandSprite.height = unitLength;
    this.upTreeSprite = this.mapchipSpriteSheet.getSprite(16, 10);
    this.upTreeSprite.width = unitLength;
    this.upTreeSprite.height = unitLength;
    this.downTreeSprite = this.mapchipSpriteSheet.getSprite(16, 11);
    this.downTreeSprite.width = unitLength;
    this.downTreeSprite.height = unitLength;

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

    this.buildTree(3, 4);
    this.buildTree(4, 3);
    this.buildTree(4, 4);
  }

  onInitialize = (engine: Engine) => {};

  buildBlock = (row: number, col: number) => {
    const cell = this.getCell(col, row);
    cell.addTag("block");
    cell.addGraphic(this.blockSprite);
  };

  buildGrassland = (row: number, col: number) => {
    const cell = this.getCell(col, row);
    cell.addGraphic(this.grasslandSprite);
  };

  buildTree = (row: number, col: number) => {
    const upCell = this.getCell(col, row);
    upCell.addTag("breakable");
    upCell.addTag("tree");
    upCell.addGraphic(this.downTreeSprite);

    const downCell = this.getCell(col, row - 1);
    downCell.addGraphic(this.upTreeSprite);
  };

  isBlock = (targetPos: Vector) => {
    const targetCell = this.getCellByPoint(targetPos.x, targetPos.y);
    return targetCell.hasTag("block");
  };

  isBreakable = (targetPos: Vector) => {
    const targetCell = this.getCellByPoint(targetPos.x, targetPos.y);
    return targetCell.hasTag("breakable");
  };

  breakdown = (targetPos: Vector) => {
    const targetCell = this.getCellByPoint(targetPos.x, targetPos.y);
    targetCell.removeGraphic(this.downTreeSprite);
    if (targetCell.hasTag("tree")) {
      const upCell = this.getCellByPoint(
        targetPos.x,
        targetPos.y - this.unitLength
      );
      upCell.removeGraphic(this.upTreeSprite);
    }
  };
}
