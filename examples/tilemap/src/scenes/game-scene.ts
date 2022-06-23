import { Scene, Engine, Vector, Logger } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Battle } from "../battle";
import config from "../config";
import { Action, Creature } from "../objects/creature";
import { Enemy } from "../objects/enemy";
import { Grid } from "../objects/grid";
import { Player } from "../objects/player";
import { TurnQueue } from "../objects/turn-stack";

export class GameScene extends Scene {
  grid!: Grid;
  player!: Player;
  turnQueue: TurnQueue;

  constructor() {
    super();
    this.turnQueue = new TurnQueue();
  }

  onInitialize = (engine: Engine) => {
    this.initMap(engine);

    this.processOthersTurns();

    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      // Player
      if (event.screenPos.x < engine.drawWidth / 4) {
        this.tryToMoveLeft(this.grid, this.player);
      } else if ((engine.drawWidth * 3) / 4 < event.screenPos.x) {
        this.tryToMoveRight(this.grid, this.player);
      }

      if (event.screenPos.y < engine.drawHeight / 4) {
        this.tryToMoveUp(this.grid, this.player);
      } else if ((engine.drawHeight * 3) / 4 < event.screenPos.y) {
        this.tryToMoveDown(this.grid, this.player);
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
    this.grid = new Grid(engine, numOfRow, numOfCol);

    for (let row = 0; row < numOfRow; row++) {
      for (let col = 0; col < numOfCol; col++) {
        if (
          row === 0 ||
          row === numOfRow - 1 ||
          col === 0 ||
          col === numOfCol - 1
        ) {
          this.grid.buildBlock(row, col);
        } else {
          this.grid.buildGrassland(row, col);
        }
      }
    }

    this.grid.buildTree(3, 4);
    this.grid.buildTree(4, 3);
    this.grid.buildTree(4, 4);

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
    const center = this.grid.getTileCenter(col, row);
    this.player = new Player(center);
    this.grid.buildCreature(this.player);
    engine.add(this.player);
    this.turnQueue.enqueueCreature(this.player);
  };

  generateEnemy = (engine: Engine, row: number, col: number) => {
    const center = this.grid.getTileCenter(col, row);
    const enemy = new Enemy(center);
    this.grid.buildCreature(enemy);
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
    this.tryToMove(this.grid, creature, targetPos);
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
    this.tryToMove(this.grid, creature, targetPos);
  };

  tryToMoveUp = (grid: Grid, creature: Creature) => {
    this.tryToMove(
      grid,
      creature,
      creature.pos.add(Vector.Up.scale(config.TileWidth))
    );
  };

  tryToMoveRight = (grid: Grid, creature: Creature) => {
    this.tryToMove(
      grid,
      creature,
      creature.pos.add(Vector.Right.scale(config.TileWidth))
    );
  };

  tryToMoveDown = (grid: Grid, creature: Creature) => {
    this.tryToMove(
      grid,
      creature,
      creature.pos.add(Vector.Down.scale(config.TileWidth))
    );
  };

  tryToMoveLeft = (grid: Grid, creature: Creature) => {
    this.tryToMove(
      grid,
      creature,
      creature.pos.add(Vector.Left.scale(config.TileWidth))
    );
  };

  tryToMove = (grid: Grid, creature: Creature, targetPos: Vector) => {
    const isBlock = grid.isBlock(targetPos);
    if (isBlock) return;

    this.breakIfNeed(grid, targetPos);

    const counterCreature = grid.getCreatureByPos(targetPos);
    if (counterCreature) {
      const battle = new Battle(creature, counterCreature);
      if (battle.isDead) {
        this.killCreature(counterCreature, grid);
        this.creatureMove(grid, creature, targetPos);
      }
      return;
    }

    this.creatureMove(grid, creature, targetPos);
  };

  creatureMove = (grid: Grid, creature: Creature, targetPos: Vector) => {
    creature.pos = targetPos;
    grid.moveCreature(creature, targetPos);
  };

  breakIfNeed = (grid: Grid, targetPos: Vector): boolean => {
    const isBreakable = grid.isBreakable(targetPos);
    if (!isBreakable) return false;
    this.grid.breakdown(targetPos);
    return true;
  };

  killCreature = (creature: Creature, grid: Grid) => {
    grid.unregisterCreature(creature);
    creature.kill();
  };
}
