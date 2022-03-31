import {
  Engine,
  Logger,
  Sprite,
  SpriteSheet,
  TileMap,
  Vector,
} from "excalibur";
import { Neighbor8, neighbor8ToVector } from "../neighbor";
import { Resources } from "../resource";
import { Enemy } from "./enemy";
import { Player } from "./player";

export class MapBuilder extends TileMap {
  mapchipSpriteSheet: SpriteSheet;
  blockSprite: Sprite;
  grasslandSprite: Sprite;
  upTreeSprite: Sprite;
  downTreeSprite: Sprite;

  constructor(public unitLength: number, numOfRow: number, numOfCol: number) {
    super({
      x: 0,
      y: 0,
      rows: numOfRow,
      cols: numOfCol,
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
  }

  onInitialize = (engine: Engine) => {};

  private registerTag = (pos: Vector, tag: string) => {
    const cell = this.getCellByPoint(pos.x, pos.y);
    cell.addTag(tag);
  };

  registerCreature = (pos: Vector, creature: Player | Enemy) => {
    const cell = this.getCellByPoint(pos.x, pos.y);
    cell.data.set("creature", creature);
    if (creature instanceof Player) {
      this.registerTag(cell.center, "player");
    } else {
      this.registerTag(cell.center, "enemy");
    }
  };

  unregisterCreature = (creature: Player | Enemy) => {
    const cells = this.data.filter(
      (cell) => cell.data.get("creature") === creature
    );
    if (cells.length !== 1) {
      Logger.getInstance().error("can not unregister because no creature.");
      return;
    }
    const cell = cells[0];
    cell.data.delete("creature");
    if (creature instanceof Player) {
      cell.removeTag("player", true);
    } else {
      cell.removeTag("enemy", true);
    }
  };

  moveCreature = (creature: Player | Enemy, direction: Neighbor8) => {
    const cells = this.data.filter(
      (cell) => cell.data.get("creature") === creature
    );
    if (cells.length !== 1) {
      Logger.getInstance().error("creature is nowhere!!");
      return;
    }
    const cell = cells[0];
    cell.data.delete("creature");

    if (creature instanceof Player) {
      cell.removeTag("player");
    } else {
      cell.removeTag("enemy");
    }

    const offset = neighbor8ToVector(direction);
    const targetCell = this.getCellByPoint(
      cell.center.x + offset.x,
      cell.center.y + offset.y
    );
    if (!targetCell) {
      Logger.getInstance().error("No cells!!");
      return;
    }

    targetCell.data.set("creature", creature);

    if (creature instanceof Player) {
      cell.addTag("player");
    } else {
      cell.addTag("enemy");
    }
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
    const offset = neighbor8ToVector(direction).scale(this.unitLength);
    const targetCell = this.getCellByPoint(pos.x + offset.x, pos.y + offset.y);
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
