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
        this.tryToMoveLeft(this.mapBuilder, this.player);
      } else if ((engine.drawWidth * 3) / 4 < event.screenPos.x) {
        this.tryToMoveRight(this.mapBuilder, this.player);
      }

      if (event.screenPos.y < engine.drawHeight / 4) {
        this.tryToMoveUp(this.mapBuilder, this.player);
      } else if ((engine.drawHeight * 3) / 4 < event.screenPos.y) {
        this.tryToMoveDown(this.mapBuilder, this.player);
      }
    });

    this.camera.strategy.elasticToActor(this.player, 0.2, 0.1);
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

    const isBlock = mapBuilder.isBlock(targetPos);
    if (isBlock) return;

    this.breakIfNeed(mapBuilder, targetPos);

    let neighbor;
    if (Vector.Up.equals(directionVector)) {
      neighbor = Neighbor8.Up;
    } else if (Vector.Right.equals(directionVector)) {
      neighbor = Neighbor8.Right;
    } else if (Vector.Down.equals(directionVector)) {
      neighbor = Neighbor8.Down;
    } else if (Vector.Left.equals(directionVector)) {
      neighbor = Neighbor8.Left;
    }

    const existEnemy = mapBuilder.hasNeighborTag(pos, "enemy", neighbor);
    if (existEnemy) {
      this.battle(player, this.enemy);
    }

    player.pos = targetPos;
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

  knockDownIfNeed = (MapBuilder: MapBuilder, targetPos: Vector): boolean => {
    // const isEnemy
    return false;
  };
}
