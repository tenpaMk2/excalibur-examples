import { Random, Vector } from "excalibur";

export class RoomInfo {
  constructor(
    public top: number,
    public right: number,
    public bottom: number,
    public left: number,
    private rnd: Random
  ) {}

  get width(): number {
    return this.right - this.left + 1;
  }

  get height(): number {
    return this.bottom - this.top + 1;
  }

  decidePathwayPoint(): Vector {
    return new Vector(
      this.rnd.integer(this.left, this.right),
      this.rnd.integer(this.top, this.bottom)
    );
  }
}
