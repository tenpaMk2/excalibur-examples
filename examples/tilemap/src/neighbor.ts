import { Logger, Vector } from "excalibur";

export enum Neighbor4 {
  Up = "Up",
  Right = "Right",
  Down = "Down",
  Left = "Left",
}

export enum Neighbor8 {
  Up = "Up",
  UpperRight = "UpperRight",
  Right = "Right",
  LowerRight = "LowerRight",
  Down = "Down",
  LowerLeft = "LowerLeft",
  Left = "Left",
  UpperLeft = "UpperLeft",
}

export const neighbor8ToVector = (neighbor8: Neighbor8) => {
  switch (neighbor8) {
    case Neighbor8.Up:
      return Vector.Up;
    case Neighbor8.UpperRight:
      return Vector.Up.add(Vector.Right);
    case Neighbor8.Right:
      return Vector.Right;
    case Neighbor8.LowerRight:
      return Vector.Down.add(Vector.Right);
    case Neighbor8.Down:
      return Vector.Down;
    case Neighbor8.LowerLeft:
      return Vector.Down.add(Vector.Left);
    case Neighbor8.Left:
      return Vector.Left;
    case Neighbor8.UpperLeft:
      return Vector.Up.add(Vector.Left);
    default:
      Logger.getInstance().warn("invalid neighbor8!!");
      break;
  }
};
