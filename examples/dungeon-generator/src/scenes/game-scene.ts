import { Color, Engine, Scene, Text, TileMap, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class GameScene extends Scene {
  private tilemap!: TileMap;

  onInitialize(engine: Engine): void {
    this.tilemap = new TileMap({
      pos: Vector.Zero,
      rows: 24,
      columns: 16,
      tileWidth: 32,
      tileHeight: 32,
    });
    engine.add(this.tilemap);

    this.tilemap.tiles.forEach((tile) => {
      tile.data.set("id", 0);
    });

    engine.input.pointers.primary.on("down", (event: PointerEvent): void => {
      this.tilemap.tiles.forEach((tile) => {
        const id = tile.data.get("id")!;
        tile.data.set("id", id + 1);
      });

      this.updateTilemap();
    });
  }

  updateTilemap(): void {
    this.tilemap.tiles.forEach((tile) => {
      const id = tile.data.get("id")!;

      const text = new Text({
        text: `${id}`,
        color: Color.White,
      });
      tile.clearGraphics();
      tile.addGraphic(text);
    });
  }
}
