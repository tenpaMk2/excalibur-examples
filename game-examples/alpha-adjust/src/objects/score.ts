import { Color, Font, Label, TextAlign } from "excalibur";

export class Score extends Label {
  constructor(x: number, y: number, diff: number) {
    super({
      x: x,
      y: y,
      text: `diff: ${diff.toFixed(2)}`,
      color: Color.White,
      font: new Font({
        size: 96,
        textAlign: TextAlign.Center,
      }),
    });
  }
}
