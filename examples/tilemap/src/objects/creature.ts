import { Actor, Vector } from "excalibur";

export enum Action {
  ComeClose = "ComeClose",
  Leave = "Leave",
}

export interface Creature extends Actor {
  HP: number;
  offence: number;
  defence: number;
  pos: Vector;
  relationship: "friend" | "hostile";

  decideAction(): Action;
}
