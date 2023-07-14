import { DisplayMode, Engine, Loader, Physics, Vector } from "excalibur";
import config from "./config";
import { Resources } from "./resource";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: config.gameWidth,
  height: config.gameHeight,
  displayMode: DisplayMode.FitScreen,
});

Physics.useRealisticPhysics();
Physics.gravity = Vector.Down.scale(300);

engine.showDebug(true);

engine.add("game-scene", new GameScene());
engine.goToScene("game-scene");

const loader = new Loader();
for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}

loader.suppressPlayButton = true;

engine.start(loader);
