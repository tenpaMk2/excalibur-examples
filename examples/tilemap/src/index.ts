import { DisplayMode, Engine, Physics } from "excalibur";
import { loader } from "./resource";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: 1080 / 2,
  height: 1920 / 2,
  displayMode: DisplayMode.FitContainer,
  canvasElementId: "game",
});

// engine.showDebug(true);

Physics.useRealisticPhysics();

engine.add("game-scene", new GameScene(engine));
engine.goToScene("game-scene");

engine.start(loader);
