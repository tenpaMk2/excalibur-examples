import { DisplayMode, Engine, Loader } from "excalibur";
import config from "./config";
import { Resources } from "./resource";
import { GameScene } from "./scenes/game-scene";

const game = new Engine({
  width: config.gameWidth,
  height: config.gameHeight,
  displayMode: DisplayMode.FitScreen,
  canvasElementId: "game",
});

game.showDebug(false);
game.add("game-scene", new GameScene());
game.goToScene("game-scene");

const loader = new Loader();
loader.suppressPlayButton = true;
for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}

game.start(loader);
