import { Scene, Engine, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Battle } from "../battle";
import config from "../config";
import { Neighbor8 } from "../neighbor";
import { Action, Creature } from "../objects/creature";
import { Enemy } from "../objects/enemy";
import { MapBuilder } from "../objects/map-builder";
import { Player } from "../objects/player";

export class GameScene extends Scene {
  mapBuilder: MapBuilder;
  player: Player;
  enemy: Enemy;

  constructor(public engine: Engine) {
    super();
  }

  onInitialize = (engine: Engine) => {
    this.initMap(engine);

    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      // Player
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

      // Enemy
      const action = this.enemy.decideAction();
      switch (action) {
        case Action.ComeClose:
          this.tryToMoveUp(this.mapBuilder, this.enemy);
          break;

        default:
          break;
      }
    });

    this.camera.strategy.elasticToActor(this.player, 0.2, 0.1);
  };

  initMap = (engine: Engine) => {
    const numOfRow = 10;
    const numOfCol = 16;
    this.mapBuilder = new MapBuilder(numOfRow, numOfCol);
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
    this.player = new Player(cell.center);
    this.mapBuilder.buildCreature(row, col, this.player);
    engine.add(this.player);
  };

  generateEnemy = (engine: Engine, row: number, col: number) => {
    const cell = this.mapBuilder.getCell(col, row);
    this.enemy = new Enemy(cell.center);
    this.mapBuilder.buildCreature(row, col, this.enemy);
    engine.add(this.enemy);
  };

  tryToMoveUp = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(mapBuilder, creature, Vector.Up);
  };

  tryToMoveRight = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(mapBuilder, creature, Vector.Right);
  };

  tryToMoveDown = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(mapBuilder, creature, Vector.Down);
  };

  tryToMoveLeft = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(mapBuilder, creature, Vector.Left);
  };

  tryToMove = (
    mapBuilder: MapBuilder,
    creature: Creature,
    directionVector: Vector
  ) => {
    const pos = creature.pos;
    const targetPos = pos.add(directionVector.scale(config.TileWidth));

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

    const counterCreature = mapBuilder.getCreatureInNeighbor8(targetPos);
    if (counterCreature) {
      const battle = new Battle(creature, counterCreature);
      if (battle.isDead) {
        this.killCreature(counterCreature, mapBuilder);
        this.creatureMove(mapBuilder, creature, targetPos);
      }
      return;
    }

    this.creatureMove(mapBuilder, creature, targetPos);
  };

  creatureMove = (
    mapBuilder: MapBuilder,
    creature: Creature,
    targetPos: Vector
  ) => {
    creature.pos = targetPos;
    mapBuilder.moveCreature(creature, targetPos);
  };

  breakIfNeed = (mapBuilder: MapBuilder, targetPos: Vector): boolean => {
    const isBreakable = mapBuilder.isBreakable(targetPos);
    if (!isBreakable) return false;
    this.mapBuilder.breakdown(targetPos);
    return true;
  };

  killCreature = (creature: Creature, mapBuilder: MapBuilder) => {
    mapBuilder.unregisterCreature(creature);
    creature.kill();
  };
}
