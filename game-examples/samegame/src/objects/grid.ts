import {
  Engine,
  Random,
  Tile,
  TileMap,
  TileMapOptions,
  Vector,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { GemType, ResourceManager } from "./resource-manager";

export class Grid extends TileMap {
  constructor(private rnd: Random, option: TileMapOptions) {
    super(option);
  }

  onInitialize(engine: Engine): void {
    this.tiles.forEach((tile) => {
      this.setGemData(tile, this.rnd.pickOne(Object.values(GemType)));
    });
    this.updateGraphic();

    engine.input.pointers.primary.on("down", (event: PointerEvent): void => {
      const tappedTile = this.getTileByPoint(event.screenPos);
      if (!tappedTile) return;

      const gemRaw = this.getGemData(tappedTile);
      if (!gemRaw) return;
      const gem = gemRaw as GemType;

      this.removeGems(tappedTile, gem);
      this.sortColumns();
      this.sortRows();
      this.updateGraphic();
    });
  }

  private updateGraphic(): void {
    const graphic = new Map();
    graphic.set(
      GemType.Sapphire,
      ResourceManager.getGemSprite(
        GemType.Sapphire,
        this.tileWidth,
        this.tileHeight
      )
    );
    graphic.set(
      GemType.Emerald,
      ResourceManager.getGemSprite(
        GemType.Emerald,
        this.tileWidth,
        this.tileHeight
      )
    );
    graphic.set(
      GemType.Ruby,
      ResourceManager.getGemSprite(
        GemType.Ruby,
        this.tileWidth,
        this.tileHeight
      )
    );
    graphic.set(
      GemType.Diamond,
      ResourceManager.getGemSprite(
        GemType.Diamond,
        this.tileWidth,
        this.tileHeight
      )
    );

    this.tiles.forEach((tile) => {
      const data = tile.data.get("gem");
      if (!data) {
        tile.clearGraphics();
        return;
      }

      const gemType = data as GemType;
      tile.clearGraphics();
      tile.addGraphic(graphic.get(gemType)!);
    });
  }

  private getGemData(tile: Tile): GemType | undefined {
    if (!tile) return undefined;
    return tile.data.get("gem") as GemType | undefined;
  }

  private setGemData(tile: Tile, gemType: GemType): void {
    tile.data.set("gem", gemType);
  }

  private removeGems(startTile: Tile, gemType: GemType): void {
    if (this.isOneTile(startTile, gemType)) return;

    this.markTile(startTile, gemType);

    this.tiles.forEach((tile) => {
      if (this.isMarked(tile)) this.deleteData(tile);
    });
  }

  private isOneTile(tile: Tile, gemType: GemType): boolean {
    if (this.getGemData(this.getUpTile(tile)) === gemType) return false;
    if (this.getGemData(this.getRightTile(tile)) === gemType) return false;
    if (this.getGemData(this.getDownTile(tile)) === gemType) return false;
    if (this.getGemData(this.getLeftTile(tile)) === gemType) return false;
    return true;
  }

  private markTile(tile: Tile, gemType: GemType): void {
    if (tile === null) return;

    if (this.getGemData(tile) !== gemType) return;

    if (this.isMarked(tile)) return;

    this.markData(tile);

    const up = this.getUpTile(tile);
    this.markTile(up, gemType);
    const right = this.getRightTile(tile);
    this.markTile(right, gemType);
    const down = this.getDownTile(tile);
    this.markTile(down, gemType);
    const left = this.getLeftTile(tile);
    this.markTile(left, gemType);
  }

  private getUpTile(tile: Tile): Tile {
    return this.getTileByPoint(tile.pos.add(Vector.Up.scale(this.tileHeight)));
  }
  private getRightTile(tile: Tile): Tile {
    return this.getTileByPoint(
      tile.pos.add(Vector.Right.scale(this.tileWidth))
    );
  }
  private getDownTile(tile: Tile): Tile {
    return this.getTileByPoint(
      tile.pos.add(Vector.Down.scale(this.tileHeight))
    );
  }
  private getLeftTile(tile: Tile): Tile {
    return this.getTileByPoint(tile.pos.add(Vector.Left.scale(this.tileWidth)));
  }

  private markData(tile: Tile): void {
    tile.data.set("mark", true);
  }

  private isMarked(tile: Tile): boolean {
    const data = tile.data.get("mark") as boolean | undefined;
    if (data === undefined) return false;
    return data;
  }

  private deleteData(tile: Tile): void {
    tile.data.delete("gem");
    tile.data.delete("mark");
  }

  private sortColumns(): void {
    this.getColumns().forEach((columnTiles) => {
      const gemTypes = columnTiles.map((tile) => this.getGemData(tile));
      const sorted = gemTypes.sort(
        (a: GemType | undefined, b: GemType | undefined) => {
          if (!a) return 1;
          if (!b) return -1;

          return 0;
        }
      );

      // dirty code💩
      const nullCount = sorted.filter((e) => e === undefined).length;
      for (let i = 0; i < nullCount; i++) {
        sorted.pop();
        sorted.unshift(undefined);
      }

      columnTiles.forEach((tile, idx) => {
        if (sorted[idx] === undefined) this.deleteData(tile);
        this.setGemData(tile, sorted[idx]!);
      });
    });
  }

  private sortRows(): void {
    const gemDatas = this.getColumns().map((columnTiles) =>
      columnTiles.map((tile) => this.getGemData(tile))
    );

    gemDatas.sort((a: (GemType | undefined)[], b: (GemType | undefined)[]) => {
      if (a.filter((gem) => gem !== undefined).length === 0) return 1;
      if (b.filter((gem) => gem !== undefined).length === 0) return -1;

      return 0;
    });

    gemDatas.forEach((datas, column) => {
      datas.forEach((data, row) => {
        const tile = this.getTileByIndex(row * this.columns + column);

        this.deleteData(tile);

        if (!data) return;
        this.setGemData(tile, data);
      });
    });
  }
}
