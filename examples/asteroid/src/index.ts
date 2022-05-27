import { DisplayMode, Engine, Physics } from "excalibur";
import { loader } from "./resource";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: 1080 / 2,
  height: 1920 / 2,
  displayMode: DisplayMode.FitScreen,
  canvasElementId: "game",
});

engine.showDebug(false);

Physics.useRealisticPhysics();

engine.add("game-scene", new GameScene());
engine.goToScene("game-scene");

engine.start(loader);
