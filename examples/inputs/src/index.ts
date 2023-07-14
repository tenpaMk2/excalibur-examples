import { DisplayMode, Engine, Loader, Physics, Vector } from "excalibur";
import config from "./config";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: config.gameWidth,
  height: config.gameHeight,
  displayMode: DisplayMode.FitScreen,
});

Physics.gravity = new Vector(0, config.gravity);
Physics.useRealisticPhysics();

engine.showDebug(config.debug);

engine.add("game-scene", new GameScene());
engine.goToScene("game-scene");

const loader = new Loader();

loader.suppressPlayButton = true;

engine.start(loader);
