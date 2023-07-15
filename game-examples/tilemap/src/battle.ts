import { Logger } from "excalibur";
import { Creature } from "./objects/creature";

export class Battle {
  isDead = false;

  constructor(attacker: Creature, defender: Creature) {
    if (attacker.HP <= 0 || defender.HP <= 0) {
      Logger.getInstance().error("zombie!!");
      return;
    }

    // battle start
    const damage = defender.defence - attacker.offence;

    // result
    defender.HP += damage;
    // TODO: effect
    if (defender.HP <= 0) {
      this.isDead = true;
    }
  }
}
