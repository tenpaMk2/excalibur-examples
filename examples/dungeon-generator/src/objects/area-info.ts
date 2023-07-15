import { Random, Side } from "excalibur";
import { config } from "../config";
import { RoomInfo } from "./room-info";

export class AreaInfo {
  roomInfo: RoomInfo | null = null;
  dividedSide: Side | null = null;

  constructor(
    public top: number,
    public right: number,
    public bottom: number,
    public left: number,
    private rnd: Random,
  ) {}

  get width(): number {
    return this.right - this.left + 1;
  }

  get height(): number {
    return this.bottom - this.top + 1;
  }

  divide(side: Side): void {
    this.dividedSide = side;

    switch (side) {
      case Side.Top:
        this.top = this.rnd.integer(
          this.top + this.height / config.divideFactor,
          this.bottom - config.minAreaEdgeLength,
        );
        break;
      case Side.Right:
        this.right = this.rnd.integer(
          this.left + config.minAreaEdgeLength,
          this.left + this.width / config.divideFactor,
        );
        break;
      case Side.Bottom:
        this.bottom = this.rnd.integer(
          this.top + config.minAreaEdgeLength,
          this.top + this.height / config.divideFactor,
        );
        break;
      case Side.Left:
        this.left = this.rnd.integer(
          this.left + this.width / config.divideFactor,
          this.right - config.minAreaEdgeLength,
        );
        break;
      case Side.None:
        throw Error("Invalid `Side` !!");
    }

    if (!this.isValidInfo()) throw Error("Invalid area info!!");
  }

  isValidInfo(): boolean {
    if (this.right < this.left) return false;
    if (this.bottom < this.top) return false;
    return true;
  }
}
