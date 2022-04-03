import { Scene, Engine, Vector, Logger } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Battle } from "../battle";
import config from "../config";
import { Action, Creature } from "../objects/creature";
import { Enemy } from "../objects/enemy";
import { MapBuilder } from "../objects/map-builder";
import { Player } from "../objects/player";
import { TurnQueue } from "../objects/turn-stack";

export class GameScene extends Scene {
  mapBuilder: MapBuilder;
  player: Player;
  turnQueue: TurnQueue;

  constructor(public engine: Engine) {
    super();
    this.turnQueue = new TurnQueue();
  }

  onInitialize = (engine: Engine) => {
    this.initMap(engine);

    this.processOthersTurns();

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
      this.turnQueue.dequeueCreature();
      this.turnQueue.enqueueCreature(this.player);

      // Enemy
      this.processOthersTurns();
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

  processOthersTurns = () => {
    while (this.turnQueue[0] !== this.player) {
      const creature = this.turnQueue.dequeueCreature();
      const action = creature.decideAction();
      switch (action) {
        case Action.ComeClose:
          this.actComeClose(creature);
          break;
        case Action.Leave:
          this.actLeave(creature);
          break;
        default:
          Logger.getInstance().error("unknown action!!");
          break;
      }
      this.turnQueue.enqueueCreature(creature);
    }
  };

  generatePlayer = (engine: Engine, row: number, col: number) => {
    const cell = this.mapBuilder.getCell(col, row);
    this.player = new Player(cell.center);
    this.mapBuilder.buildCreature(row, col, this.player);
    engine.add(this.player);
    this.turnQueue.enqueueCreature(this.player);
  };

  generateEnemy = (engine: Engine, row: number, col: number) => {
    const cell = this.mapBuilder.getCell(col, row);
    const enemy = new Enemy(cell.center);
    this.mapBuilder.buildCreature(row, col, enemy);
    engine.add(enemy);
    this.turnQueue.enqueueCreature(enemy);
  };

  actComeClose = (creature: Creature) => {
    const candidatePoss = [
      creature.pos.add(Vector.Up.scale(config.TileWidth)),
      creature.pos.add(Vector.Right.scale(config.TileWidth)),
      creature.pos.add(Vector.Down.scale(config.TileWidth)),
      creature.pos.add(Vector.Left.scale(config.TileWidth)),
    ];
    const targetPos = candidatePoss.reduce((prev, current) => {
      return prev.distance(this.player.pos) < current.distance(this.player.pos)
        ? prev
        : current;
    });
    this.tryToMove(this.mapBuilder, creature, targetPos);
  };

  actLeave = (creature: Creature) => {
    const candidatePoss = [
      creature.pos.add(Vector.Up.scale(config.TileWidth)),
      creature.pos.add(Vector.Right.scale(config.TileWidth)),
      creature.pos.add(Vector.Down.scale(config.TileWidth)),
      creature.pos.add(Vector.Left.scale(config.TileWidth)),
    ];
    const targetPos = candidatePoss.reduce((prev, current) => {
      return current.distance(this.player.pos) < prev.distance(this.player.pos)
        ? prev
        : current;
    });
    this.tryToMove(this.mapBuilder, creature, targetPos);
  };

  tryToMoveUp = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(
      mapBuilder,
      creature,
      creature.pos.add(Vector.Up.scale(config.TileWidth))
    );
  };

  tryToMoveRight = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(
      mapBuilder,
      creature,
      creature.pos.add(Vector.Right.scale(config.TileWidth))
    );
  };

  tryToMoveDown = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(
      mapBuilder,
      creature,
      creature.pos.add(Vector.Down.scale(config.TileWidth))
    );
  };

  tryToMoveLeft = (mapBuilder: MapBuilder, creature: Creature) => {
    this.tryToMove(
      mapBuilder,
      creature,
      creature.pos.add(Vector.Left.scale(config.TileWidth))
    );
  };

  tryToMove = (
    mapBuilder: MapBuilder,
    creature: Creature,
    targetPos: Vector
  ) => {
    const isBlock = mapBuilder.isBlock(targetPos);
    if (isBlock) return;

    this.breakIfNeed(mapBuilder, targetPos);

    const counterCreature = mapBuilder.getCreatureByPos(targetPos);
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
