import { Vector } from "excalibur";

export type Polar = { r: number; radian: number };

export class VectorUtil {
  constructor() {}

  static toPolar = (vec: Vector) => {
    const polar: Polar = {
      r: Math.sqrt(vec.x * vec.x + vec.y * vec.y),
      radian: Math.atan2(vec.y, vec.x),
    };
    return polar;
  };

  static fromPolar = (polar: Polar) => {
    return new Vector(
      polar.r * Math.cos(polar.radian),
      polar.r * Math.sin(polar.radian)
    );
  };
}
