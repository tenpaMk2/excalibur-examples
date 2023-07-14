// reference-src: https://github.com/excaliburjs/sample-grid/blob/main/src/dirt-grid.ts

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

export class Grid {
  public infoMap!: TileMap;
  public foregroundMap!: TileMap;
  public backgroundMap!: TileMap;
  public upTreeMap!: TileMap;
  public downTreeMap!: TileMap;
  public mapchipSpriteSheet: SpriteSheet;
  public blockSprite: Sprite;
  public grasslandSprite: Sprite;
  public upTreeSprite: Sprite;
  public downTreeSprite: Sprite;

  constructor(engine: Engine, numOfRow: number, numOfCol: number) {
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
    this.blockSprite = this.mapchipSpriteSheet.getSprite(6, 0)!;
    this.blockSprite.width = config.TileWidth;
    this.blockSprite.height = config.TileWidth;
    this.grasslandSprite = this.mapchipSpriteSheet.getSprite(5, 0)!;
    this.grasslandSprite.width = config.TileWidth;
    this.grasslandSprite.height = config.TileWidth;
    this.upTreeSprite = this.mapchipSpriteSheet.getSprite(16, 10)!;
    this.upTreeSprite.width = config.TileWidth;
    this.upTreeSprite.height = config.TileWidth;
    this.downTreeSprite = this.mapchipSpriteSheet.getSprite(16, 11)!;
    this.downTreeSprite.width = config.TileWidth;
    this.downTreeSprite.height = config.TileWidth;

    const tileMapConfig = {
      pos: Vector.Zero,
      rows: numOfRow,
      columns: numOfCol,
      tileWidth: config.TileWidth,
      tileHeight: config.TileWidth,
    };
    this.infoMap = new TileMap(tileMapConfig);
    this.backgroundMap = new TileMap(tileMapConfig);
    this.foregroundMap = new TileMap(tileMapConfig);
    this.upTreeMap = new TileMap(tileMapConfig);
    this.downTreeMap = new TileMap(tileMapConfig);
    this.upTreeMap.z = 100000;
    engine.add(this.infoMap);
    engine.add(this.backgroundMap);
    engine.add(this.foregroundMap);
    engine.add(this.upTreeMap);
    engine.add(this.downTreeMap);
  }

  onInitialize = (_engine: Engine) => {};

  getTileCenter(x: number, y: number): Vector {
    const tile = this.infoMap.getTile(x, y);
    return tile.center;
  }

  registerCreature = (point: Vector, creature: Creature) => {
    const cell = this.infoMap.getTileByPoint(point);
    cell.data.set("creature", creature);
  };

  unregisterCreature = (creature: Creature) => {
    const cells = this.infoMap.tiles.filter(
      (tile) => tile.data.get("creature") === creature
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
  };

  moveCreature = (creature: Creature, targetPos: Vector) => {
    const cells = this.infoMap.tiles.filter(
      (tile) => tile.data.get("creature") === creature
    );
    if (cells.length <= 0) {
      Logger.getInstance().error("can not move because no creatures exist.");
      return;
    }
    if (2 <= cells.length) {
      Logger.getInstance().error(
        "can not move because multiple creatures exist."
      );
      return;
    }
    const cell = cells[0];
    cell.data.delete("creature");

    const targetCell = this.infoMap.getTileByPoint(targetPos);
    if (!targetCell) {
      Logger.getInstance().error("No cells!!");
      return;
    }

    targetCell.data.set("creature", creature);
  };

  getCreatureByPos = (targetPos: Vector): Creature | null => {
    const targetCell = this.infoMap.getTileByPoint(targetPos);
    if (!targetCell) return null;
    return targetCell.data.get("creature");
  };

  buildBlock = (row: number, col: number) => {
    const cell = this.foregroundMap.getTile(col, row);
    if (!cell) throw Error("can not get tile!!");
    cell.addGraphic(this.blockSprite);

    const cell2 = this.infoMap.getTile(col, row)!;
    cell2.data.set("isBlock", true);
  };

  buildGrassland = (row: number, col: number) => {
    const cell = this.backgroundMap.getTile(col, row);
    cell.addGraphic(this.grasslandSprite);
  };

  buildTree = (row: number, col: number) => {
    const upCell = this.upTreeMap.getTile(col, row - 1);
    if (!upCell) throw Error("can not get tile!!");
    upCell.addGraphic(this.upTreeSprite);

    const downCell = this.downTreeMap.getTile(col, row);
    if (!downCell) throw Error("can not get tile!!");
    downCell.addGraphic(this.downTreeSprite);

    const cell2 = this.infoMap.getTile(col, row)!;
    cell2.data.set("isBreakable", true);
    cell2.data.set("isTree", true);
  };

  buildCreature = (creature: Creature) => {
    this.registerCreature(creature.pos, creature);
  };

  isBlock = (targetPos: Vector) => {
    const targetCell = this.infoMap.getTileByPoint(targetPos);
    if (!targetCell) throw Error("can not get tile!!");
    return targetCell.data.get("isBlock");
  };

  isBreakable = (targetPos: Vector) => {
    const targetCell = this.infoMap.getTileByPoint(targetPos);
    if (!targetCell) throw Error("can not get tile!!");
    return targetCell.data.get("isBreakable");
  };

  breakdown = (targetPos: Vector) => {
    const targetCell = this.infoMap.getTileByPoint(targetPos);
    if (!targetCell) throw Error("can not get tile!!");

    if (targetCell.data.get("isTree")) {
      const upTreeTile = this.upTreeMap.getTileByPoint(
        targetPos.sub(Vector.Down.scale(config.TileWidth))
      );
      upTreeTile.clearGraphics();
      const downTreeTile = this.downTreeMap.getTileByPoint(targetPos);
      downTreeTile.clearGraphics();
    }

    targetCell.data.delete("tree");
    targetCell.data.delete("breakable");
  };

  _debugData = (key: string) => {
    const cell2d = this.infoMap.getRows();
    const result = cell2d.map((cells) =>
      cells.map((cell) => (cell.data.has(key) ? "⭕" : "➖"))
    );
    result.forEach((rows) => console.log(rows));
  };
}
