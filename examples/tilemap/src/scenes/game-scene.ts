import { Scene, Engine, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Battle } from "../battle";
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
    this.initMap(engine);

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

  initMap = (engine: Engine) => {
    const numOfRow = 10;
    const numOfCol = 16;
    this.mapBuilder = new MapBuilder(GameScene.UNIT_LENGTH, numOfRow, numOfCol);
    engine.add(this.mapBuilder);

    for (let row = 0; row < numOfRow; row++) {
      for (let col = 0; col < numOfCol; col++) {
        if (
          row === 0 ||
          row === numOfRow - 1 ||
          col === 0 ||
          col === numOfCol - 1
        ) {
          this.mapBuilder.buildBlock(row, col);
        } else {
          this.mapBuilder.buildGrassland(row, col);
        }
      }
    }

    this.mapBuilder.buildTree(3, 4);
    this.mapBuilder.buildTree(4, 3);
    this.mapBuilder.buildTree(4, 4);

    this.generatePlayer(engine, 3, 2);
    this.generateEnemy(engine, 8, 7);
  };

  generatePlayer = (engine: Engine, row: number, col: number) => {
    const cell = this.mapBuilder.getCell(col, row);
    this.player = new Player(cell.center, GameScene.UNIT_LENGTH);
    engine.add(this.player);
    this.mapBuilder.registerCreature(this.player.pos, this.player);
  };

  generateEnemy = (engine: Engine, row: number, col: number) => {
    const cell = this.mapBuilder.getCell(col, row);
    this.enemy = new Enemy(cell.center, GameScene.UNIT_LENGTH);
    engine.add(this.enemy);
    this.mapBuilder.registerCreature(this.enemy.pos, this.enemy);
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
      const battle = new Battle(player, this.enemy);
      if (battle.isDead) {
        this.killCreature(this.enemy, mapBuilder);
        this.playerMove(mapBuilder, player, targetPos);
      }
      return;
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

  killCreature = (creature: Player | Enemy, mapBuilder: MapBuilder) => {
    mapBuilder.unregisterCreature(creature);
    creature.kill();
  };
}
