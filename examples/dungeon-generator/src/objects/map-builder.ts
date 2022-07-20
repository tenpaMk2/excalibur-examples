import {
  Engine,
  Logger,
  Random,
  Side,
  TileMap,
  TileMapOptions,
  Vector,
} from "excalibur";
import { AreaInfo } from "./area-info";
import { DungeonMap } from "./dungeon-map";
import { RoomInfo } from "./room-info";

export type BuildOptions = {
  divideCount: number;
  divideFactor: number;
  additionalPathwayCount: number;
  minAreaEdgeLength: number;
};

export class MapBuilder {
  private tilemap: TileMap;
  private currentAreaID: number = 1;
  private currentRoomID: number = 0;
  private currentPathwayID: number = 1;
  private areaInfos: AreaInfo[] = [];

  constructor(
    engine: Engine,
    private rnd: Random,
    options: TileMapOptions,
    private buildOptions: BuildOptions
  ) {
    this.tilemap = new TileMap(options);
    engine.add(this.tilemap);
  }

  build(): DungeonMap {
    this.makeArea(
      this.currentAreaID,
      0,
      this.tilemap.columns - 1,
      this.tilemap.rows - 1,
      0
    );
    for (let i = 0; i < this.buildOptions.divideCount; i++) {
      this.divideArea(this.currentAreaID);
    }

    for (let id = 1; id <= this.currentAreaID; id++) {
      this.makeRoom(id);
    }

    for (let id = 1; id <= this.currentRoomID - 1; id++) {
      this.makePathway(id);
    }

    for (let i = 0; i < this.buildOptions.additionalPathwayCount; i++) {
      const roomIDs = [...Array(this.currentAreaID - 1)].map((_, id) => id + 1);

      const [id1, id2] = this.rnd.pickSet(roomIDs, 2, false);
      this.makeAdditionalPathway(id1, id2);
      this.removePathway(id1 < id2 ? id1 : id2);
    }

    return new DungeonMap(this.tilemap, {
      areaCount: this.currentAreaID,
      roomCount: this.currentRoomID,
      pathwayCount: this.currentPathwayID,
    });
  }

  private makeArea(
    id: number,
    up: number,
    right: number,
    down: number,
    left: number
  ): void {
    this.markMap("areaID", id, up, right, down, left);
    this.areaInfos[this.currentAreaID] = new AreaInfo(
      up,
      right,
      down,
      left,
      this.rnd
    );
  }

  private markRoom(
    id: number,
    up: number,
    right: number,
    down: number,
    left: number
  ): void {
    this.markMap("roomID", id, up, right, down, left);
  }

  private markPathway(
    id: number,
    up: number,
    right: number,
    down: number,
    left: number
  ): void {
    this.markMap("pathwayID", id, up, right, down, left);
  }

  private markMap(
    key: string,
    id: number,
    up: number,
    right: number,
    down: number,
    left: number
  ): void {
    for (let column = left; column <= right; column++) {
      for (let row = up; row <= down; row++) {
        const point = new Vector(
          column * this.tilemap.tileWidth,
          row * this.tilemap.tileHeight
        );
        const tile = this.tilemap.getTileByPoint(point);
        tile.data.set(key, id);
      }
    }
  }

  private divideArea(areaID: number): void {
    const isVertical = this.rnd.bool();
    const areaInfo = this.areaInfos[areaID];
    const top = areaInfo.top;
    const right = areaInfo.right;
    const bottom = areaInfo.bottom;
    const left = areaInfo.left;
    const width = areaInfo.width;
    const height = areaInfo.height;

    if (isVertical) {
      if (width < this.buildOptions.minAreaEdgeLength * 2) {
        Logger.getInstance().warn("Too small(width) to divide the area.");
        return;
      }

      this.areaInfos[this.currentAreaID].divide(Side.Right);

      this.currentAreaID++;
      this.makeArea(this.currentAreaID, top, right, bottom, areaInfo.right + 1);
    } else {
      if (height < this.buildOptions.minAreaEdgeLength * 2) {
        Logger.getInstance().warn("Too small(height) to divide the area.");
        return;
      }

      this.areaInfos[this.currentAreaID].divide(Side.Bottom);

      this.currentAreaID++;
      this.makeArea(
        this.currentAreaID,
        areaInfo.bottom + 1,
        right,
        bottom,
        left
      );
    }
  }

  private makeRoom(areaID: number) {
    const info = this.areaInfos[areaID];

    let x1, x2, y1, y2;
    let count = 0;
    do {
      [x1, x2] = this.rnd.range(2, info.left + 1, info.right - 1);
      [y1, y2] = this.rnd.range(2, info.top + 1, info.bottom - 1);
      count++;
      if (5 < count) {
        Logger.getInstance().warn("Reach the loop limit!!");
        break;
      }
    } while (Math.abs(x2 - x1) <= 1 || Math.abs(y2 - y1) <= 1);

    const left = x1 < x2 ? x1 : x2;
    const right = x1 < x2 ? x2 : x1;
    const top = y1 < y2 ? y1 : y2;
    const bottom = y1 < y2 ? y2 : y1;

    this.currentRoomID++;
    const roomInfo = new RoomInfo(top, right, bottom, left, this.rnd);
    this.areaInfos[this.currentRoomID].roomInfo = roomInfo;

    this.markRoom(this.currentRoomID, top, right, bottom, left);
  }

  private makePathway(id: number) {
    switch (this.areaInfos[id].dividedSide) {
      case Side.Right:
        this.makeRightPathway(id);
        break;
      case Side.Bottom:
        this.makeDownPathway(id);
        break;

      default:
        break;
    }
  }

  private makeRightPathway(id: number) {
    const areaInfo = this.areaInfos[id];
    const roomInfo = areaInfo.roomInfo!;
    const nextRoomInfo = this.areaInfos[id + 1].roomInfo!;
    const p1 = roomInfo.decidePathwayPoint();
    const p2 = nextRoomInfo.decidePathwayPoint();
    const yBottom = p1.y < p2.y ? p2.y : p1.y;
    const yTop = p1.y < p2.y ? p1.y : p2.y;

    this.markPathway(this.currentPathwayID, p1.y, areaInfo.right, p1.y, p1.x);
    this.markPathway(
      this.currentPathwayID,
      yTop,
      areaInfo.right,
      yBottom,
      areaInfo.right
    );
    this.markPathway(this.currentPathwayID, p2.y, p2.x, p2.y, areaInfo.right);
    this.currentPathwayID++;
  }

  private makeDownPathway(id: number) {
    const areaInfo = this.areaInfos[id];
    const roomInfo = areaInfo.roomInfo!;
    const nextRoomInfo = this.areaInfos[id + 1].roomInfo!;
    const p1 = roomInfo.decidePathwayPoint();
    const p2 = nextRoomInfo.decidePathwayPoint();
    const xRight = p1.x < p2.x ? p2.x : p1.x;
    const xLeft = p1.x < p2.x ? p1.x : p2.x;

    this.markPathway(this.currentPathwayID, p1.y, p1.x, areaInfo.bottom, p1.x);
    this.markPathway(
      this.currentPathwayID,
      areaInfo.bottom,
      xRight,
      areaInfo.bottom,
      xLeft
    );
    this.markPathway(this.currentPathwayID, areaInfo.bottom, p2.x, p2.y, p2.x);
    this.currentPathwayID++;
  }

  private makeAdditionalPathway(id1: number, id2: number) {
    const p1raw = this.areaInfos[id1].roomInfo!.decidePathwayPoint();
    const p2raw = this.areaInfos[id2].roomInfo!.decidePathwayPoint();
    const p1 = p1raw.x < p2raw.x ? p1raw : p2raw;
    const p2 = p1raw.x < p2raw.x ? p2raw : p1raw;

    const left = p1.x;
    const right = p2.x;
    const isVertical = this.rnd.bool();
    if (p1.y < p2.y) {
      const top = p1.y;
      const bottom = p2.y;
      if (isVertical) {
        // ┐
        // └
        const x = this.rnd.integer(left, right);
        this.markPathway(this.currentPathwayID, top, x, top, left);
        this.markPathway(this.currentPathwayID, top, x, bottom, x);
        this.markPathway(this.currentPathwayID, bottom, right, bottom, x);
      } else {
        // └┐
        const y = this.rnd.integer(top, bottom);
        this.markPathway(this.currentPathwayID, top, left, y, left);
        this.markPathway(this.currentPathwayID, y, right, y, left);
        this.markPathway(this.currentPathwayID, y, right, bottom, right);
      }
    } else {
      const top = p2.y;
      const bottom = p1.y;
      if (isVertical) {
        // ┌
        // ┘
        const x = this.rnd.integer(left, right);
        this.markPathway(this.currentPathwayID, bottom, x, bottom, left);
        this.markPathway(this.currentPathwayID, top, x, bottom, x);
        this.markPathway(this.currentPathwayID, top, right, top, x);
      } else {
        // ┌┘
        const y = this.rnd.integer(top, bottom);
        this.markPathway(this.currentPathwayID, y, left, bottom, left);
        this.markPathway(this.currentPathwayID, y, right, y, left);
        this.markPathway(this.currentPathwayID, top, right, y, right);
      }
    }
    this.currentPathwayID++;
  }

  private removePathway(id: number): void {
    this.tilemap.tiles.forEach((tile) => {
      const pathwayID = tile.data.get("pathwayID");
      if (pathwayID !== id) return;
      tile.data.delete("pathwayID");
    });
  }
}
