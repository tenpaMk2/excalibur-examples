// refer: <https://github.com/excaliburjs/Excalibur/discussions/2406>

import {
  Actor,
  CollisionEndEvent,
  CollisionGroup,
  CollisionGroupManager,
  CollisionStartEvent,
  CollisionType,
  Color,
  Engine,
  PreCollisionEvent,
  Ray,
  Scene,
  Side,
  Vector,
} from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";

export class GameScene extends Scene {
  private playerGroup!: CollisionGroup;
  private player1!: Actor;
  private player2!: Actor;
  private player3!: Actor;
  private ground3A!: Actor;
  private ground3B!: Actor;
  private player1SideCollisions: Side[] = [];
  private activeGroundCollisions: number = 0;

  onInitialize(engine: Engine): void {
    this.playerGroup = CollisionGroupManager.create("player");

    this.initSolution1(engine);
    this.initSolution2(engine);
    this.initSolution3(engine);

    engine.input.pointers.primary.on("down", (event: PointerEvent): void => {
      if (this.isPlayer1OnGround()) {
        this.player1.vel = this.player1.vel.add(new Vector(0, -100)); // jump!!
      }
      if (this.isPlayer2OnGround()) {
        this.player2.vel = this.player2.vel.add(new Vector(0, -100)); // jump!!
      }
      if (this.isPlayer3OnGround()) {
        this.player3.vel = this.player3.vel.add(new Vector(0, -100)); // jump!!
      }
    });
  }

  initSolution1(engine: Engine) {
    const groundA = new Actor({
      pos: new Vector(200, 250),
      width: 300,
      height: 40,
      color: Color.Cyan,
      collisionType: CollisionType.Fixed,
    });
    engine.add(groundA);

    const groundB = new Actor({
      pos: new Vector(400, 200),
      width: 100,
      height: 200,
      color: Color.Magenta,
      collisionType: CollisionType.Fixed,
    });
    engine.add(groundB);

    this.player1 = new Actor({
      pos: new Vector(300, 100),
      width: 20,
      height: 20,
      color: Color.Chartreuse,
      collisionType: CollisionType.Active,
    });
    engine.add(this.player1);

    this.player1.vel = new Vector(30, 0);

    this.player1.on("postcollision", (event: PreCollisionEvent): void => {
      this.player1SideCollisions.push(event.side);
    });
  }

  initSolution2(engine: Engine) {
    const groundA = new Actor({
      pos: new Vector(200, 550),
      width: 300,
      height: 40,
      color: Color.Cyan,
      collisionType: CollisionType.Fixed,
    });
    engine.add(groundA);

    const groundB = new Actor({
      pos: new Vector(400, 500),
      width: 100,
      height: 200,
      color: Color.Magenta,
      collisionType: CollisionType.Fixed,
    });
    engine.add(groundB);

    this.player2 = new Actor({
      pos: new Vector(300, 400),
      width: 20,
      height: 20,
      color: Color.Chartreuse,
      collisionType: CollisionType.Active,
      collisionGroup: this.playerGroup,
    });
    engine.add(this.player2);

    const player2HitBox = new Actor({
      x: 0,
      y: this.player2.height / 2,
      width: this.player2.width,
      height: 1,
      color: Color.Rose,
      collisionType: CollisionType.Passive,
      collisionGroup: this.playerGroup,
    });
    engine.add(player2HitBox);
    this.player2.addChild(player2HitBox);

    this.player2.vel = new Vector(30, 0);

    player2HitBox.on("collisionstart", (event: CollisionStartEvent): void => {
      this.activeGroundCollisions++;
    });
    player2HitBox.on("collisionend", (event: CollisionEndEvent): void => {
      this.activeGroundCollisions--;
    });
  }

  initSolution3(engine: Engine) {
    this.ground3A = new Actor({
      pos: new Vector(200, 850),
      width: 300,
      height: 40,
      color: Color.Cyan,
      collisionType: CollisionType.Fixed,
    });
    engine.add(this.ground3A);

    this.ground3B = new Actor({
      pos: new Vector(400, 800),
      width: 100,
      height: 200,
      color: Color.Magenta,
      collisionType: CollisionType.Fixed,
    });
    engine.add(this.ground3B);

    this.player3 = new Actor({
      pos: new Vector(300, 700),
      width: 20,
      height: 20,
      color: Color.Chartreuse,
      collisionType: CollisionType.Active,
    });
    engine.add(this.player3);

    this.player3.vel = new Vector(30, 0);
  }

  onPreUpdate(engine: Engine, delta: number): void {
    this.player1SideCollisions.length = 0;
  }

  private isPlayer1OnGround(): boolean {
    return this.player1SideCollisions.includes(Side.Bottom);
  }

  private isPlayer2OnGround(): boolean {
    return 0 < this.activeGroundCollisions;
  }

  private isPlayer3OnGround(): boolean {
    for (let ground of [this.ground3A, this.ground3B]) {
      const hit = ground.collider
        .get()
        .rayCast(
          new Ray(this.player3.pos, Vector.Down),
          this.player3.height / 2
        ); // length to cast
      if (hit) {
        return true;
      }
      return false;
    }
    return false;
  }
}
