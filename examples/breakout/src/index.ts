import { DisplayMode, Engine } from "excalibur";
import { loader } from "./resource";
import { Level } from "./scenes/level";

const game = new Engine({
  width: 90 * 4,
  height: 160 * 4,
  displayMode: DisplayMode.FitContainer,
  canvasElementId: "game",
});

game.add("level", new Level(game));
game.goToScene("level");

game.start(loader);
