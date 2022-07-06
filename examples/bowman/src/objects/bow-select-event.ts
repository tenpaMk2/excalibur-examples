import { Actor, GameEvent } from "excalibur";

export type BowType = "Normal" | "Metal" | "Hell";
export class BowSelectEvent extends GameEvent<Actor> {
  constructor(public bowType: BowType) {
    super();
  }
}
