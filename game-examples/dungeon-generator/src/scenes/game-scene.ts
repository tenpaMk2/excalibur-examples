import { Engine, Random, Scene, Vector } from "excalibur";
import { config } from "../config";
import { MapBuilder } from "../objects/map-builder";

export class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    const rnd = new Random(config.randomSeed);

    const mapBuilder = new MapBuilder(
      engine,
      rnd,
      {
        pos: Vector.Zero,
        rows: 48,
        columns: 32,
        tileWidth: 16,
        tileHeight: 16,
      },
      {
        divideCount: config.divideCount,
        divideFactor: config.divideFactor,
        additionalPathwayCount: config.additionalPathwayCount,
        minAreaEdgeLength: config.minAreaEdgeLength,
      },
    );
    const dungeonMap = mapBuilder.build();
    dungeonMap.updateTilemap();
  }
}
