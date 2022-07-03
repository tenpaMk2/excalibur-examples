import { Actor, GameEvent } from "excalibur";

export class DeathEvent extends GameEvent<Actor> {
  stringData: string;
  numberData: number;

  constructor(stringData: string, numberData: number) {
    super();
    this.stringData = stringData;
    this.numberData = numberData;
  }
}
