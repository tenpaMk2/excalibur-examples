import { DisplayMode, Engine, Physics, Vector } from "excalibur";
import config from "./config";
import { loader } from "./resources";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: config.gameWidth,
  height: config.gameHeight,
  displayMode: DisplayMode.FitScreen,
  canvasElementId: "game",
});

// engine.showDebug(true);

Physics.useRealisticPhysics();
Physics.checkForFastBodies = true;
Physics.acc = new Vector(0, 980);

engine.add("game-scene", new GameScene());
engine.goToScene("game-scene");

engine.start(loader);
