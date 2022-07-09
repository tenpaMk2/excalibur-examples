import { DisplayMode, Engine } from "excalibur";
import config from "./config";
import { loader } from "./resource";
import { Level } from "./scenes/level";

const game = new Engine({
  width: config.gameWidth,
  height: config.gameHeight,
  displayMode: DisplayMode.FitScreen,
  canvasElementId: "game",
});

game.add("level", new Level());
game.goToScene("level");

game.start(loader);
