import {
  Engine,
  Logger,
  Sprite,
  SpriteSheet,
  TileMap,
  Vector,
} from "excalibur";
import config from "../config";
import { Resources } from "../resource";
import { Creature } from "./creature";

export class MapBuilder extends TileMap {
  mapchipSpriteSheet: SpriteSheet;
  blockSprite: Sprite;
  grasslandSprite: Sprite;
  upTreeSprite: Sprite;
  downTreeSprite: Sprite;

  constructor(numOfRow: number, numOfCol: number) {
    super({
      x: 0,
      y: 0,
      rows: numOfRow,
      cols: numOfCol,
      cellWidth: config.TileWidth,
      cellHeight: config.TileWidth,
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
    this.blockSprite.width = config.TileWidth;
    this.blockSprite.height = config.TileWidth;
    this.grasslandSprite = this.mapchipSpriteSheet.getSprite(5, 0);
    this.grasslandSprite.width = config.TileWidth;
    this.grasslandSprite.height = config.TileWidth;
    this.upTreeSprite = this.mapchipSpriteSheet.getSprite(16, 10);
    this.upTreeSprite.width = config.TileWidth;
    this.upTreeSprite.height = config.TileWidth;
    this.downTreeSprite = this.mapchipSpriteSheet.getSprite(16, 11);
    this.downTreeSprite.width = config.TileWidth;
    this.downTreeSprite.height = config.TileWidth;
  }

  onInitialize = (engine: Engine) => {};

  private registerTag = (pos: Vector, tag: string) => {
    const cell = this.getCellByPoint(pos.x, pos.y);
    cell.addTag(tag);
  };

  registerCreature = (pos: Vector, creature: Creature) => {
    const cell = this.getCellByPoint(pos.x, pos.y);
    cell.data.set("creature", creature);
    this.registerTag(cell.center, "creature");
  };

  unregisterCreature = (creature: Creature) => {
    const cells = this.data.filter(
      (cell) => cell.data.get("creature") === creature
    );
    if (cells.length <= 0) {
      Logger.getInstance().error("can not unregister because no creatures.");
      return;
    }
    if (2 <= cells.length) {
      Logger.getInstance().error(
        "can not unregister because multiple creatures."
      );
      return;
    }
    const cell = cells[0];
    cell.data.delete("creature");
    cell.removeTag("creature", true);
  };

  moveCreature = (creature: Creature, targetPos: Vector) => {
    const cells = this.data.filter(
      (cell) => cell.data.get("creature") === creature
    );
    if (cells.length <= 0) {
      Logger.getInstance().error("can not move because no creatures.");
      return;
    }
    if (2 <= cells.length) {
      Logger.getInstance().error("can not move because multiple creatures.");
      return;
    }
    const cell = cells[0];
    cell.data.delete("creature");
    cell.removeTag("creature", true);

    const targetCell = this.getCellByPoint(targetPos.x, targetPos.y);
    if (!targetCell) {
      Logger.getInstance().error("No cells!!");
      return;
    }

    targetCell.data.set("creature", creature);
    targetCell.addTag("creature");
  };

  getCreatureByPos = (targetPos: Vector): Creature => {
    const targetCell = this.getCellByPoint(targetPos.x, targetPos.y);
    if (!targetCell) return null;
    return targetCell.data.get("creature");
  };

  buildBlock = (row: number, col: number) => {
    const cell = this.getCell(col, row);
    this.registerTag(
      new Vector(col * config.TileWidth, row * config.TileWidth),
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
      new Vector(col * config.TileWidth, row * config.TileWidth),
      "breakable"
    );
    this.registerTag(
      new Vector(col * config.TileWidth, row * config.TileWidth),
      "tree"
    );
    upCell.addGraphic(this.downTreeSprite);

    const downCell = this.getCell(col, row - 1);
    downCell.addGraphic(this.upTreeSprite);
  };

  buildCreature = (row: number, col: number, creature: Creature) => {
    const cell = this.getCell(col, row);
    this.registerCreature(creature.pos, creature);
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
        targetPos.y - config.TileWidth
      );
      upCell.removeGraphic(this.upTreeSprite);
    }

    targetCell.removeTag("tree", true);
    targetCell.removeTag("breakable", true);
  };

  _debugTag = (tag: string) => {
    const cell2d = this.getRows();
    const result = cell2d.map((cells) =>
      cells.map((cell) => (cell.hasTag(tag) ? "⭕" : "➖"))
    );
    result.forEach((rows) => console.log(rows));
  };
}
