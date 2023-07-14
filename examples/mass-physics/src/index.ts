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
Physics.acc = new Vector(0, config.gravity);

engine.showDebug(false);
engine.add("game-scene", new GameScene(engine));
engine.goToScene("game-scene");

const loader = new Loader();
for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}

loader.suppressPlayButton = true;

engine.start(loader);
