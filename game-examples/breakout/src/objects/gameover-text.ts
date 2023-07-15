import { Color, Font, Label, TextAlign } from "excalibur";

export class GameOverText extends Label {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      text: "GameOver",
      color: Color.White,
      font: new Font({
        size: 48,
        textAlign: TextAlign.Center,
      }),
    });
  }
}
