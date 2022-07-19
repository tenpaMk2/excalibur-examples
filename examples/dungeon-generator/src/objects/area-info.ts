import { Side } from "excalibur";
import { RoomInfo } from "./room-info";

export class AreaInfo {
  roomInfo: RoomInfo | null = null;
  dividedSide: Side | null = null;

  constructor(
    public top: number,
    public right: number,
    public bottom: number,
    public left: number
  ) {}

  get width(): number {
    return this.right - this.left + 1;
  }

  get height(): number {
    return this.bottom - this.top + 1;
  }

  divide(side: Side, line: number): void {
    this.dividedSide = side;

    switch (side) {
      case Side.Top:
        this.top = line;
        break;
      case Side.Right:
        this.right = line;
        break;
      case Side.Bottom:
        this.bottom = line;
        break;
      case Side.Left:
        this.left = line;
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
