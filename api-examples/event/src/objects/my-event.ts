import { Actor, GameEvent } from "excalibur";

export class DeathEvent extends GameEvent<Actor> {
  constructor(public stringData: string, public numberData: number) {
    super();
  }
}
