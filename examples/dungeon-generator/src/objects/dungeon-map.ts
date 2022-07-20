import { Color, Font, SpriteSheet, Text, TileMap } from "excalibur";
import config from "../config";
import { Resources } from "../resource";

type DungeonMapInfo = {
  areaCount: number;
  roomCount: number;
  pathwayCount: number;
};

export class DungeonMap {
  readonly areaCount: number;
  readonly roomCount: number;
  readonly pathwayCount: number;

  constructor(private tilemap: TileMap, info: DungeonMapInfo) {
    this.areaCount = info.areaCount;
    this.roomCount = info.roomCount;
    this.pathwayCount = info.pathwayCount;
  }

  updateTilemap(): void {
    if (config.debug) {
      this.updateTilemapDebug();
      return;
    }

    const spritesheet = SpriteSheet.fromImageSource({
      image: Resources.mapchip,
      grid: {
        rows: 22,
        columns: 49,
        spriteHeight: 16,
        spriteWidth: 16,
      },
    });
    const roomSprite = spritesheet.getSprite(4, 0)!;
    const pathwaySprite = spritesheet.getSprite(2, 0)!;
    const wallSprite = spritesheet.getSprite(0, 13)!;

    this.tilemap.tiles.forEach((tile) => {
      const roomID = tile.data.get("roomID");
      if (roomID) {
        tile.clearGraphics();
        tile.addGraphic(roomSprite);
        return;
      }

      const pathwayID = tile.data.get("pathwayID");
      if (pathwayID) {
        tile.clearGraphics();
        tile.addGraphic(pathwaySprite);
        return;
      }

      const areaID = tile.data.get("areaID");
      if (areaID) {
        tile.clearGraphics();
        tile.addGraphic(wallSprite);
        return;
      }
    });
  }

  private updateTilemapDebug(): void {
    const font = new Font({
      family: "mono",
      size: 8,
    });
    const areaTexts: Text[] = [];
    for (let id = 0; id <= this.areaCount; id++) {
      areaTexts.push(
        new Text({
          text: `${id}`,
          color: Color.White,
          font: font.clone(),
        })
      );
    }
    const roomTexts: Text[] = [];
    for (let id = 0; id <= this.roomCount; id++) {
      roomTexts.push(
        new Text({
          text: `${id}`,
          color: Color.Chartreuse,
          font: font.clone(),
        })
      );
    }
    const pathwayTexts: Text[] = [];
    for (let id = 0; id <= this.pathwayCount; id++) {
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
        const graphic = roomTexts[roomID];
        tile.clearGraphics();
        tile.addGraphic(graphic);
        return;
      }
      const pathwayID = tile.data.get("pathwayID");
      if (pathwayID) {
        const graphic = pathwayTexts[pathwayID];
        tile.clearGraphics();
        tile.addGraphic(graphic);
        return;
      }
      const areaID = tile.data.get("areaID");
      if (areaID) {
        const graphic = areaTexts[areaID];
        tile.clearGraphics();
        tile.addGraphic(graphic);
        return;
      }
    });
  }
}
