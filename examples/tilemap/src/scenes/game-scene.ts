import { Scene, Engine, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { MapBuilder } from "../objects/map-builder";
import { Player } from "../objects/player";

export class GameScene extends Scene {
  tilemap: MapBuilder;
  static readonly UNIT_LENGTH = 64;

  constructor(public engine: Engine) {
    super();
  }

  onInitialize = (engine: Engine) => {
    this.tilemap = new MapBuilder(GameScene.UNIT_LENGTH);
    engine.add(this.tilemap);

    const cell = this.tilemap.getCell(2, 3);
    const player = new Player(cell.center, GameScene.UNIT_LENGTH);
    engine.add(player);

    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      if (event.screenPos.x < engine.drawWidth / 4) {
        this.tryToMoveLeft(this.tilemap, player);
      } else if ((engine.drawWidth * 3) / 4 < event.screenPos.x) {
        this.tryToMoveRight(this.tilemap, player);
      }

      if (event.screenPos.y < engine.drawHeight / 4) {
        this.tryToMoveUp(this.tilemap, player);
      } else if ((engine.drawHeight * 3) / 4 < event.screenPos.y) {
        this.tryToMoveDown(this.tilemap, player);
      }
    });

    this.camera.strategy.elasticToActor(player, 0.2, 0.1);
  };

  tryToMoveUp = (mapBuilder: MapBuilder, player: Player) => {
    this.tryToMove(mapBuilder, player, Vector.Up);
  };

  tryToMoveRight = (mapBuilder: MapBuilder, player: Player) => {
    this.tryToMove(mapBuilder, player, Vector.Right);
  };

  tryToMoveDown = (mapBuilder: MapBuilder, player: Player) => {
    this.tryToMove(mapBuilder, player, Vector.Down);
  };

  tryToMoveLeft = (mapBuilder: MapBuilder, player: Player) => {
    this.tryToMove(mapBuilder, player, Vector.Left);
  };

  tryToMove = (
    mapBuilder: MapBuilder,
    player: Player,
    directionVector: Vector
  ) => {
    const pos = player.pos;
    const targetPos = pos.add(directionVector.scale(GameScene.UNIT_LENGTH));

    this.breakIfNeed(mapBuilder, targetPos);

    const targetCell = mapBuilder.getCellByPoint(targetPos.x, targetPos.y);
    const isBlocked = targetCell.data.get("isBlocked");
    if (isBlocked) return;
    player.pos = targetPos;
  };

  breakIfNeed = (mapBuilder: MapBuilder, targetPos: Vector) => {
    const isBreakable = mapBuilder.isBreakable(targetPos);
    if (!isBreakable) return;
    this.tilemap.breakdown(targetPos);
  };
}
