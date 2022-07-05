import { Actor, GameEvent } from "excalibur";

export class BracingEvent extends GameEvent<Actor> {
  constructor(public power: number, public angle: number) {
    super();
  }
}
