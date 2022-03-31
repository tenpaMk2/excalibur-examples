import {
  Engine,
  Logger,
  Sprite,
  SpriteSheet,
  TileMap,
  Vector,
} from "excalibur";
import { Neighbor8 } from "../neighbor";
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

  registerTag = (pos: Vector, tag: string) => {
    const cell = this.getCellByPoint(pos.x, pos.y);
    cell.addTag(tag);
  };

  moveTag = (targetPos: Vector, tag: string) => {
    const taggedCells = this.data.filter((cell) => cell.hasTag(tag));
    if (taggedCells.length !== 1) {
      Logger.getInstance().error("invalid tag number!!");
      return;
    }
    const taggedCell = taggedCells[0];
    taggedCell.removeTag(tag, true);

    const newCell = this.getCellByPoint(targetPos.x, targetPos.y);
    newCell.addTag(tag);
  };

  hasTagInNeighbor8 = (
    pos: Vector,
    tag: string,
    direction: Neighbor8
  ): boolean => {
    let offsetX = 0;
    let offsetY = 0;
    switch (direction) {
      case Neighbor8.Up:
        offsetY = -this.unitLength;
        break;
      case Neighbor8.UpperRight:
        offsetX = this.unitLength;
        offsetY = -this.unitLength;
        break;
      case Neighbor8.Right:
        offsetX = this.unitLength;
        break;
      case Neighbor8.LowerRight:
        offsetX = this.unitLength;
        offsetY = this.unitLength;
        break;
      case Neighbor8.Down:
        offsetY = this.unitLength;
        break;
      case Neighbor8.LowerLeft:
        offsetX = -this.unitLength;
        offsetY = this.unitLength;
        break;
      case Neighbor8.Left:
        offsetX = -this.unitLength;
        break;
      case Neighbor8.UpperLeft:
        offsetX = -this.unitLength;
        offsetY = -this.unitLength;
        break;
      default:
        Logger.getInstance().warn("invalid neighbor8!!");
        break;
    }
    const targetCell = this.getCellByPoint(pos.x + offsetX, pos.y + offsetY);
    if (!targetCell) return null;

    return targetCell.hasTag(tag);
  };

  buildBlock = (row: number, col: number) => {
    const cell = this.getCell(col, row);
    this.registerTag(
      new Vector(col * this.unitLength, row * this.unitLength),
      "block"
    );
    cell.addGraphic(this.blockSprite);
  };

  buildGrassland = (row: number, col: number) => {
    const cell = this.getCell(col, row);
    cell.addGraphic(this.grasslandSprite);
  };

  buildTree = (row: number, col: number) => {
    const upCell = this.getCell(col, row);
    this.registerTag(
      new Vector(col * this.unitLength, row * this.unitLength),
      "breakable"
    );
    this.registerTag(
      new Vector(col * this.unitLength, row * this.unitLength),
      "tree"
    );
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
