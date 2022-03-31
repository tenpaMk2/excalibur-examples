import { Scene, Engine, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Neighbor8 } from "../neighbor";
import { Enemy } from "../objects/enemy";
import { MapBuilder } from "../objects/map-builder";
import { Player } from "../objects/player";

export class GameScene extends Scene {
  mapBuilder: MapBuilder;
  player: Player;
  enemy: Enemy;
  static readonly UNIT_LENGTH = 64;

  constructor(public engine: Engine) {
    super();
  }

  onInitialize = (engine: Engine) => {
    this.mapBuilder = new MapBuilder(GameScene.UNIT_LENGTH);
    engine.add(this.mapBuilder);

    const cell = this.mapBuilder.getCell(2, 3);
    this.player = new Player(cell.center, GameScene.UNIT_LENGTH);
    engine.add(this.player);
    this.mapBuilder.registerTag(this.player.pos, "player");

    const enemyCell = this.mapBuilder.getCell(7, 8);
    this.enemy = new Enemy(enemyCell.center, GameScene.UNIT_LENGTH);
    engine.add(this.enemy);
    this.mapBuilder.registerTag(this.enemy.pos, "enemy");

    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      if (event.screenPos.x < engine.drawWidth / 4) {
        this.playerTryToMoveLeft(this.mapBuilder, this.player);
      } else if ((engine.drawWidth * 3) / 4 < event.screenPos.x) {
        this.playerTryToMoveRight(this.mapBuilder, this.player);
      }

      if (event.screenPos.y < engine.drawHeight / 4) {
        this.playerTryToMoveUp(this.mapBuilder, this.player);
      } else if ((engine.drawHeight * 3) / 4 < event.screenPos.y) {
        this.playerTryToMoveDown(this.mapBuilder, this.player);
      }
    });

    this.camera.strategy.elasticToActor(this.player, 0.2, 0.1);
  };

  playerTryToMoveUp = (mapBuilder: MapBuilder, player: Player) => {
    this.playerTryToMove(mapBuilder, player, Vector.Up);
  };

  playerTryToMoveRight = (mapBuilder: MapBuilder, player: Player) => {
    this.playerTryToMove(mapBuilder, player, Vector.Right);
  };

  playerTryToMoveDown = (mapBuilder: MapBuilder, player: Player) => {
    this.playerTryToMove(mapBuilder, player, Vector.Down);
  };

  playerTryToMoveLeft = (mapBuilder: MapBuilder, player: Player) => {
    this.playerTryToMove(mapBuilder, player, Vector.Left);
  };

  playerTryToMove = (
    mapBuilder: MapBuilder,
    player: Player,
    directionVector: Vector
  ) => {
    const pos = player.pos;
    const targetPos = pos.add(directionVector.scale(GameScene.UNIT_LENGTH));

    const isBlock = mapBuilder.isBlock(targetPos);
    if (isBlock) return;

    this.breakIfNeed(mapBuilder, targetPos);

    let direction;
    if (Vector.Up.equals(directionVector)) {
      direction = Neighbor8.Up;
    } else if (Vector.Right.equals(directionVector)) {
      direction = Neighbor8.Right;
    } else if (Vector.Down.equals(directionVector)) {
      direction = Neighbor8.Down;
    } else if (Vector.Left.equals(directionVector)) {
      direction = Neighbor8.Left;
    }

    const existEnemy = mapBuilder.hasTagInNeighbor8(pos, "enemy", direction);
    if (existEnemy) {
      this.battle(player, this.enemy);
    }

    this.playerMove(mapBuilder, player, targetPos);
  };

  playerMove = (mapBuilder: MapBuilder, player: Player, targetPos: Vector) => {
    player.pos = targetPos;
    mapBuilder.moveTag(targetPos, "player");
  };

  breakIfNeed = (mapBuilder: MapBuilder, targetPos: Vector): boolean => {
    const isBreakable = mapBuilder.isBreakable(targetPos);
    if (!isBreakable) return false;
    this.mapBuilder.breakdown(targetPos);
    return true;
  };

  battle = (attacker: Player | Enemy, defender: Enemy | Player) => {
    defender.kill();
  };
}
