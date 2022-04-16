import {
  Scene,
  Engine,
  CollisionStartEvent,
  Random,
  Vector,
  Logger,
} from "excalibur";
import { Asteroid } from "../objects/asteroid";
import { Bullet } from "../objects/bullet";
import { Ship } from "../objects/ship";

export class GameScene extends Scene {
  ship: Ship;
  asteroids: Asteroid[];

  constructor() {
    super();
    this.asteroids = [];
  }

  onInitialize = (engine: Engine) => {
    this.ship = new Ship(engine.halfDrawWidth, engine.halfDrawHeight);
    engine.add(this.ship);

    const pos1 = this.generateInitialAsteroidPosition(engine);
    this.generateAsteroid(engine, pos1.x, pos1.y, "hexagon");
    const pos2 = this.generateInitialAsteroidPosition(engine);
    this.generateAsteroid(engine, pos2.x, pos2.y, "hexagon");
    const pos3 = this.generateInitialAsteroidPosition(engine);
    this.generateAsteroid(engine, pos3.x, pos3.y, "hexagon");

    // Inputs
    // @ts-ignore
    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      // Control thruster
      // @ts-ignore
      if (event.screenPos.x < engine.drawWidth / 4) {
        this.ship.thrustTurnLeft();
        // @ts-ignore
      } else if ((engine.drawWidth * 3) / 4 < event.screenPos.x) {
        this.ship.thrustTurnRight();
      } else {
        this.ship.thrustForwardStart();
      }

      // Generate Bullet
      if (
        // @ts-ignore
        engine.drawWidth / 4 < event.screenPos.x &&
        // @ts-ignore
        event.screenPos.x < (engine.drawWidth * 3) / 4
      ) {
        this.shoot(engine);
      }
    });
    // @ts-ignore
    engine.input.pointers.primary.on("up", (event: PointerEvent) => {
      this.ship.thrustEnd();
    });
  };

  onPreUpdate = (engine: Engine, delta: number): void => {};

  shoot = (engine: Engine) => {
    const bullet = new Bullet(
      this.ship.pos.x,
      this.ship.pos.y,
      this.ship.rotation
    );
    engine.add(bullet);

    bullet.on("collisionstart", (event: CollisionStartEvent<Asteroid>) => {
      if (!this.asteroids.includes(event.other)) {
        return;
      }
      const asteroid = event.other;

      switch (asteroid.type) {
        case "hexagon":
          this.generateAsteroid(
            engine,
            asteroid.pos.x,
            asteroid.pos.y,
            "pentagon"
          );
          this.generateAsteroid(
            engine,
            asteroid.pos.x,
            asteroid.pos.y,
            "pentagon"
          );
          break;
        case "pentagon":
          this.generateAsteroid(
            engine,
            asteroid.pos.x,
            asteroid.pos.y,
            "square"
          );
          this.generateAsteroid(
            engine,
            asteroid.pos.x,
            asteroid.pos.y,
            "square"
          );
          break;
        default:
          Logger.getInstance().warn("invalid astedoid type!!");
      }

      asteroid.kill();
      this.asteroids = this.asteroids.filter((x) => !x.isKilled());

      bullet.kill();
    });
  };

  generateAsteroid = (
    engine: Engine,
    x: number,
    y: number,
    type: "square" | "pentagon" | "hexagon"
  ) => {
    const asteroid = new Asteroid(x, y, type);
    this.asteroids.push(asteroid);
    engine.add(asteroid);
  };

  generateInitialAsteroidPosition = (engine: Engine) => {
    return new Vector(
      new Random().floating(0, engine.drawWidth),
      new Random().pickOne([
        new Random().floating(0, engine.drawHeight / 4),
        new Random().floating((engine.drawHeight * 3) / 4, engine.drawHeight),
      ])
    );
  };
}
