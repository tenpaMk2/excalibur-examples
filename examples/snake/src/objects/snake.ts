import {
  Actor,
  CollisionType,
  Engine,
  Sprite,
  SpriteSheet,
  Timer,
  Vector,
} from "excalibur";
import config from "../config";
import { Resources } from "../resource";

export class Snake {
  private bodies: Actor[] = [];
  private endSprites: Sprite[] = []; // up, right, down, left
  private bodiesprites: Sprite[] = []; // up-down, right-left, up-right, right-down, down-left, left-up
  private currentDirection!: Vector = Vector.Up;

  constructor(pos: Vector, engine: Engine) {
    this.prepareGraphics();

    const head = new Actor({
      pos: pos,
      radius: config.TileWidth / 3,
      collisionType: CollisionType.Active,
    });

    head.graphics.use(this.endSprites[0]);
    this.bodies.push(head);
    engine.add(head);

    const timer = new Timer({
      interval: config.snakeInterval,
      repeats: true,
      fcn: () => {
        this.move(this.currentDirection);
      },
    });
    engine.currentScene.add(timer);
    timer.start();

    this.pushTail(engine);
  }

  private prepareGraphics(): void {
    const mapchipSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.mapchip,
      grid: {
        rows: 31,
        columns: 57,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
      },
    });

    [
      [6, 23],
      [5, 24],
      [5, 23],
      [6, 24],
    ].forEach((rowCol) => {
      const sprite = mapchipSpriteSheet.getSprite(rowCol[0], rowCol[1]);
      if (!sprite) throw new Error("cannot get sprite!!");
      sprite.width = config.TileWidth;
      sprite.height = config.TileWidth;

      this.endSprites.push(sprite);
    });

    [
      [9, 19],
      [9, 20],
      [7, 20],
      [7, 19],
      [8, 19],
      [8, 20],
    ].forEach((rowCol) => {
      const sprite = mapchipSpriteSheet.getSprite(rowCol[0], rowCol[1]);
      if (!sprite) throw new Error("cannot get sprite!!");
      sprite.width = config.TileWidth;
      sprite.height = config.TileWidth;

      this.bodiesprites.push(sprite);
    });
  }

  getHead(): Actor {
    if (this.bodies.length === 0) throw Error("No bodies!!");
    return this.bodies[0];
  }

  turn = (direction4: Vector): void => {
    if (this.currentDirection.add(direction4).size === 0) return; // ignore back
    this.currentDirection = direction4;
  };

  // expect: Vector.Up, Vector.Right, Vector.Down, Vector.Left
  private move(direction4: Vector): void {
    // temporally save current positions
    const positions: Vector[] = []; // from head to tail
    this.bodies.forEach((body) => {
      // bodies and tail
      positions.push(body.pos.clone());
    });

    // move
    // : head
    const head = this.getHead();
    head.pos = head.pos.add(direction4.scale(config.TileWidth));
    // : bodies
    for (let i = 1; i < this.bodies.length; i++) {
      this.bodies[i].pos = positions[i - 1];
    }

    this.updateGraphic();
  }

  private updateGraphic(): void {
    this.updateEndGraphic(this.bodies[0], this.bodies[1]); // head
    this.updateEndGraphic(this.bodies.slice(-1)[0], this.bodies.slice(-2)[0]); // tail

    for (let i = 1; i < this.bodies.length - 1; i++) {
      this.updateNotEndGraphic(
        this.bodies[i],
        this.bodies[i - 1],
        this.bodies[i + 1]
      );
    }
  }

  private updateEndGraphic(target: Actor, other: Actor): void {
    if (target.pos.add(Vector.Down.scale(config.TileWidth)).equals(other.pos)) {
      target.graphics.use(this.endSprites[0]);
    } else if (
      target.pos.add(Vector.Left.scale(config.TileWidth)).equals(other.pos)
    ) {
      target.graphics.use(this.endSprites[1]);
    } else if (
      target.pos.add(Vector.Up.scale(config.TileWidth)).equals(other.pos)
    ) {
      target.graphics.use(this.endSprites[2]);
    } else if (
      target.pos.add(Vector.Right.scale(config.TileWidth)).equals(other.pos)
    ) {
      target.graphics.use(this.endSprites[3]);
    } else if (target.pos.equals(other.pos)) {
      // do nothing (not use any graphic. keep parenthness.)
    } else {
      throw Error("Bodies are at invalid positions!!");
    }
  }

  private updateNotEndGraphic(
    target: Actor,
    other1: Actor,
    other2: Actor
  ): void {
    let other1PosNumber: 0 | 1 | 2 | 3 | 4 = 0; // same, up, right, down, left
    let other2PosNumber: 0 | 1 | 2 | 3 | 4 = 0;

    const otherPositions = [other1, other2]
      .map((other) => {
        if (
          target.pos.add(Vector.Up.scale(config.TileWidth)).equals(other.pos)
        ) {
          return 1;
        } else if (
          target.pos.add(Vector.Right.scale(config.TileWidth)).equals(other.pos)
        ) {
          return 2;
        } else if (
          target.pos.add(Vector.Down.scale(config.TileWidth)).equals(other.pos)
        ) {
          return 3;
        } else if (
          target.pos.add(Vector.Left.scale(config.TileWidth)).equals(other.pos)
        ) {
          return 4;
        } else if (target.pos.equals(other.pos)) {
          return 0;
        } else {
          throw Error("Bodies are at invalid positions!!");
        }
      })
      .sort();

    // if any `other` is at same position as `target` , It does not change graphics.
    if (otherPositions.includes(0)) return;

    if (otherPositions[0] === 1 && otherPositions[1] == 2) {
      target.graphics.use(this.bodiesprites[2]);
    } else if (otherPositions[0] === 1 && otherPositions[1] == 3) {
      target.graphics.use(this.bodiesprites[0]);
    } else if (otherPositions[0] === 1 && otherPositions[1] == 4) {
      target.graphics.use(this.bodiesprites[5]);
    } else if (otherPositions[0] === 2 && otherPositions[1] == 3) {
      target.graphics.use(this.bodiesprites[3]);
    } else if (otherPositions[0] === 2 && otherPositions[1] == 4) {
      target.graphics.use(this.bodiesprites[1]);
    } else if (otherPositions[0] === 3 && otherPositions[1] == 4) {
      target.graphics.use(this.bodiesprites[4]);
    }
  }

  pushTail(engine: Engine): void {
    const tail = new Actor({
      pos: this.bodies.slice(-1)[0].pos,
      radius: config.TileWidth / 3,
      collisionType: CollisionType.Passive,
    });
    this.bodies.push(tail);
    // this.addChild(tail);
    engine.add(tail);
  }
}
