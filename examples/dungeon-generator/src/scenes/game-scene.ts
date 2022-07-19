import {
  Color,
  Engine,
  Font,
  Logger,
  Random,
  Scene,
  Text,
  TileMap,
  Vector,
} from "excalibur";

type Direction = "Up" | "Right" | "Down" | "Left";
export class GameScene extends Scene {
  private tilemap!: TileMap;
  private rnd: Random = new Random(1234);
  private currentAreaID: number = 1;
  private currentRoomID: number = 1;
  private currentPathwayID: number = 1;

  onInitialize(engine: Engine): void {
    this.tilemap = new TileMap({
      pos: Vector.Zero,
      rows: 48,
      columns: 32,
      tileWidth: 16,
      tileHeight: 16,
    });
    engine.add(this.tilemap);

    this.markArea(
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

    for (let id = 1; id <= this.currentRoomID; id++) {
      this.makePathway(id);
    }

    this.updateTilemap();
  }

  updateTilemap(): void {
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

  markArea(
    id: number,
    up: number,
    right: number,
    down: number,
    left: number
  ): void {
    this.markCore("areaID", id, up, right, down, left);
  }

  markRoom(
    id: number,
    up: number,
    right: number,
    down: number,
    left: number
  ): void {
    this.markCore("roomID", id, up, right, down, left);
  }

  markPathway(
    id: number,
    up: number,
    right: number,
    down: number,
    left: number
  ): void {
    this.markCore("pathwayID", id, up, right, down, left);
  }

  markCore(
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

  divideArea(areaID: number): void {
    const isVertical = this.rnd.bool();
    const { up, right, down, left, width, height } = this.getAreaInfo(areaID);

    if (isVertical) {
      if (width <= 6) {
        Logger.getInstance().warn("Too small(width) to divide the area.");
        return;
      }

      const dividingLine = this.decideDividingLine(left, width)!;
      this.currentAreaID++;
      this.markArea(this.currentAreaID, up, right, down, dividingLine);
    } else {
      if (height <= 6) {
        Logger.getInstance().warn("Too small(height) to divide the area.");
        return;
      }

      const dividingLine = this.decideDividingLine(up, height)!;
      this.currentAreaID++;
      this.markArea(this.currentAreaID, dividingLine, right, down, left);
    }
  }

  getAreaInfo(areaID: number): {
    up: number;
    right: number;
    down: number;
    left: number;
    width: number;
    height: number;
  } {
    return this.getInfoCore("areaID", areaID);
  }

  getRoomInfo(roomID: number): {
    up: number;
    right: number;
    down: number;
    left: number;
    width: number;
    height: number;
  } {
    return this.getInfoCore("roomID", roomID);
  }

  getInfoCore(
    key: string,
    targetID: number
  ): {
    up: number;
    right: number;
    down: number;
    left: number;
    width: number;
    height: number;
  } {
    let upmost = this.tilemap.rows - 1;
    let rightmost = 0;
    let downmost = 0;
    let leftmost = this.tilemap.columns - 1;

    this.tilemap.tiles.forEach((tile) => {
      if (tile.data.get(key) === targetID) {
        const { col: column, row } = this.posToColRow(tile.pos);

        upmost = row < upmost ? row : upmost;
        downmost = downmost < row ? row : downmost;
        rightmost = rightmost < column ? column : rightmost;
        leftmost = column < leftmost ? column : leftmost;
      }
    });

    return {
      up: upmost,
      right: rightmost,
      down: downmost,
      left: leftmost,
      width: rightmost - leftmost + 1,
      height: downmost - upmost + 1,
    };
  }

  posToColRow(pos: Vector): { col: number; row: number } {
    return {
      col: Math.floor(pos.x / this.tilemap.tileWidth),
      row: Math.floor(pos.y / this.tilemap.tileHeight),
    };
  }

  decideDividingLine(offset: number, range: number) {
    if (range <= 6) {
      Logger.getInstance().warn("Too small to dicide the dividing line.");
      return null;
    }
    return offset + this.rnd.integer(3, range - 4);
  }

  makeRoom(areaID: number) {
    const { up, right, down, left, width, height } = this.getAreaInfo(areaID);

    const rLeft = this.rnd.integer(left + 1, right - 2);
    const rRight = this.rnd.integer(rLeft + 1, right - 1);
    const rUp = this.rnd.integer(up + 1, down - 2);
    const rDown = this.rnd.integer(rUp + 1, down - 1);

    this.markRoom(this.currentRoomID, rUp, rRight, rDown, rLeft);
    this.currentRoomID++;
  }

  makePathway(roomID: number) {
    const { up, right, down, left, width, height } = this.getRoomInfo(roomID);
    const roomX = this.rnd.integer(left, right);
    const roomY = this.rnd.integer(up, down);
    const areaID = roomID;

    {
      const { x, y } = this.searchDividingLine(areaID, areaID - 1, "Up");
      if (y) {
        this.markPathway(this.currentPathwayID, y, roomX, roomY, roomX);
        this.currentPathwayID++;
      }
    }
    {
      const { x, y } = this.searchDividingLine(areaID, areaID + 1, "Down");
      if (y) {
        this.markPathway(this.currentPathwayID, roomY, roomX, y, roomX);
        this.currentPathwayID++;
      }
    }
    {
      {
        const { x, y } = this.searchDividingLine(areaID, areaID - 1, "Left");
        if (x) {
          this.markPathway(this.currentPathwayID, roomY, roomX, roomY, x);
          this.currentPathwayID++;
        }
      }
    }
    {
      const { x, y } = this.searchDividingLine(areaID, areaID + 1, "Right");
      if (x) {
        this.markPathway(this.currentPathwayID, roomY, x, roomY, roomX);
        this.currentPathwayID++;
      }
    }
  }

  searchDividingLine(
    srcAreaID: number,
    dstAreaID: number,
    direction: Direction
  ): { x: number | null; y: number | null } {
    if (srcAreaID === dstAreaID)
      throw Error(
        "Cannot search dividing line because src and dst IDs are same!!"
      );

    const { up, right, down, left, width, height } =
      this.getAreaInfo(srcAreaID);

    switch (direction) {
      case "Up":
        for (let x = left; x <= right; x++) {
          const columnArray = this.tilemap.getColumns()[x];
          const columnAreaIDs: number[] = columnArray.map((tile) =>
            tile.data.get("areaID")
          );
          const index = columnAreaIDs.findLastIndex(
            (value: number) => value === dstAreaID
          );
          if (index !== -1) return { x: null, y: index + 1 };
        }
        break;
      case "Down":
        for (let x = left; x <= right; x++) {
          const columnArray = this.tilemap.getColumns()[x];
          const columnAreaIDs: number[] = columnArray.map((tile) =>
            tile.data.get("areaID")
          );
          const index = columnAreaIDs.findIndex(
            (value: number) => value === dstAreaID
          );
          if (index !== -1) return { x: null, y: index - 1 };
        }
        break;
      case "Left":
        for (let y = up; y <= down; y++) {
          const rowArray = this.tilemap.getRows()[y];
          const rowAreaIDs: number[] = rowArray.map((tile) =>
            tile.data.get("areaID")
          );
          const index = rowAreaIDs.findLastIndex(
            (value: number) => value === dstAreaID
          );
          if (index !== -1) return { x: index + 1, y: null };
        }
        break;
      case "Right":
        for (let y = up; y <= down; y++) {
          const rowArray = this.tilemap.getRows()[y];
          const rowAreaIDs: number[] = rowArray.map((tile) =>
            tile.data.get("areaID")
          );
          const index = rowAreaIDs.findIndex(
            (value: number) => value === dstAreaID
          );
          if (index !== -1) return { x: index - 1, y: null };
        }
        break;
    }

    return { x: null, y: null };
  }
}
