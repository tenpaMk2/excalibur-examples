import { Creature } from "./creature";

// priority queue
export class TurnQueue extends Array {
  enqueueCreature = (creature: Creature) => {
    creature.timeUntilNextTurn = creature.slowness;
    this.push(creature);
    this.sort(
      (a: Creature, b: Creature) => a.timeUntilNextTurn - b.timeUntilNextTurn
    );
  };

  dequeueCreature = (): Creature => {
    const creature = this.shift();
    this.elapseTime(creature.timeUntilNextTurn);
    return creature;
  };

  elapseTime = (time: number) => {
    this.forEach((creature) => {
      creature.timeUntilNextTurn -= time;
    });
  };
}
