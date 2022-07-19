import {
  Color,
  Engine,
  Font,
  Logger,
  Random,
  Scene,
  Side,
  Text,
  TileMap,
  Vector,
} from "excalibur";
import { AreaInfo } from "../objects/area-info";
import { RoomInfo } from "../objects/room-info";

export class GameScene extends Scene {
  private tilemap!: TileMap;
  private rnd: Random = new Random(1234);
  private currentAreaID: number = 1;
  private currentRoomID: number = 1;
  private currentPathwayID: number = 1;
  private areaInfos: AreaInfo[] = [];

  onInitialize(engine: Engine): void {
    this.tilemap = new TileMap({
      pos: Vector.Zero,
      rows: 48,
      columns: 32,
      tileWidth: 16,
      tileHeight: 16,
    });
    engine.add(this.tilemap);

    this.makeArea(
      this.currentAreaID,
      0,
      this.tilemap.columns - 1,
      this.tilemap.rows - 1,
      0
    );
    this.divideArea(this.currentAreaID);
    this.divideArea(this.currentAreaID);
    this.divideArea(this.currentAreaID);
    this.divideArea(this.currentAreaID);
    this.divideArea(this.currentAreaID);

    for (let id = 1; id <= this.currentAreaID; id++) {
      this.makeRoom(id);
    }

    for (let id = 1; id <= this.currentRoomID - 1; id++) {
      this.makePathway(id);
    }

    this.updateTilemap();
  }

  private updateTilemap(): void {
    const font = new Font({
      family: "mono",
      size: 8,
    });

    const areaTexts: Text[] = [];
    for (let id = 0; id <= this.currentAreaID; id++) {
      areaTexts.push(
        new Text({
          text: `${id}`,
          color: Color.White,
          font: font.clone(),
        })
      );
    }

    const roomTexts: Text[] = [];
    for (let id = 0; id <= this.currentRoomID; id++) {
      roomTexts.push(
        new Text({
          text: `${id}`,
          color: Color.Chartreuse,
          font: font.clone(),
        })
      );
    }

    const pathwayTexts: Text[] = [];
    for (let id = 0; id <= this.currentPathwayID; id++) {
      pathwayTexts.push(
        new Text({
          text: `${id}`,
          color: Color.Rose,
          font: font.clone(),
        })
      );
    }

    this.tilemap.tiles.forEach((tile) => {
      const roomID = tile.data.get("roomID");
      if (roomID) {
        const text = roomTexts[roomID];

        tile.clearGraphics();
        tile.addGraphic(text);
        return;
      }

      const pathwayID = tile.data.get("pathwayID");
      if (pathwayID) {
        const text = pathwayTexts[pathwayID];

        tile.clearGraphics();
        tile.addGraphic(text);
        return;
      }

      const areaID = tile.data.get("areaID");
      if (areaID) {
        const text = areaTexts[areaID];

        tile.clearGraphics();
        tile.addGraphic(text);
        return;
      }
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
    this.areaInfos[this.currentAreaID] = new AreaInfo(up, right, down, left);
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
      if (width <= 6) {
        Logger.getInstance().warn("Too small(width) to divide the area.");
        return;
      }

      const dividingLine = this.decideDividingLine(left, width)!;

      this.areaInfos[this.currentAreaID].divide(Side.Right, dividingLine - 1);

      this.currentAreaID++;
      this.makeArea(this.currentAreaID, top, right, bottom, dividingLine);
    } else {
      if (height <= 6) {
        Logger.getInstance().warn("Too small(height) to divide the area.");
        return;
      }

      const dividingLine = this.decideDividingLine(top, height)!;

      this.areaInfos[this.currentAreaID].divide(Side.Bottom, dividingLine - 1);

      this.currentAreaID++;
      this.makeArea(this.currentAreaID, dividingLine, right, bottom, left);
    }
  }

  private decideDividingLine(offset: number, range: number) {
    if (range <= 6) {
      Logger.getInstance().warn("Too small to dicide the dividing line.");
      return null;
    }
    return offset + this.rnd.integer(3, range - 4);
  }

  private makeRoom(areaID: number) {
    const info = this.areaInfos[areaID];

    const left = this.rnd.integer(info.left + 1, info.right - 2);
    const right = this.rnd.integer(left + 1, info.right - 1);
    const top = this.rnd.integer(info.top + 1, info.bottom - 2);
    const bottom = this.rnd.integer(top + 1, info.bottom - 1);

    const roomInfo = new RoomInfo(top, right, bottom, left, this.rnd);
    this.areaInfos[this.currentRoomID].roomInfo = roomInfo;

    this.markRoom(this.currentRoomID, top, right, bottom, left);
    this.currentRoomID++;
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
}
