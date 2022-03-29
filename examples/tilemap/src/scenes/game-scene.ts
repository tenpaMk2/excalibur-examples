import { Scene, Engine, TileMap, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { MapBuilder } from "../objects/map-builder";
import { Player } from "../objects/player";

export class GameScene extends Scene {
  static readonly UNIT_LENGTH = 64;

  constructor(public engine: Engine) {
    super();
  }

  onInitialize = (engine: Engine) => {
    const tilemap = new MapBuilder(GameScene.UNIT_LENGTH);
    engine.add(tilemap);

    const cell = tilemap.getCell(2, 3);
    const player = new Player(cell.center, GameScene.UNIT_LENGTH);
    engine.add(player);

    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      if (event.screenPos.x < engine.drawWidth / 4) {
        this.tryToMoveLeft(tilemap, player);
      } else if ((engine.drawWidth * 3) / 4 < event.screenPos.x) {
        this.tryToMoveRight(tilemap, player);
      }

      if (event.screenPos.y < engine.drawHeight / 4) {
        this.tryToMoveUp(tilemap, player);
      } else if ((engine.drawHeight * 3) / 4 < event.screenPos.y) {
        this.tryToMoveDown(tilemap, player);
      }
    });

    this.camera.strategy.elasticToActor(player, 0.2, 0.1);
  };

  tryToMoveUp = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Up);
  };

  tryToMoveRight = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Right);
  };

  tryToMoveDown = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Down);
  };

  tryToMoveLeft = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Left);
  };

  tryToMove = (tilemap: TileMap, player: Player, directionVector: Vector) => {
    const pos = player.pos;
    const targetPos = pos.add(directionVector.scale(GameScene.UNIT_LENGTH));
    const targetCell = tilemap.getCellByPoint(targetPos.x, targetPos.y);
    const isBlocked = targetCell.data.get("isBlocked");
    if (isBlocked) return;
    player.pos = targetPos;
  };
}
