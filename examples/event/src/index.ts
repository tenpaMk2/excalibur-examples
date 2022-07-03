import { DisplayMode, Engine, Loader } from "excalibur";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: 1920 / 2,
  height: 1080 / 2,
  canvasElementId: "game",
  displayMode: DisplayMode.FitScreen,
});

engine.add("game-scene", new GameScene());
engine.goToScene("game-scene");

const loader = new Loader();

loader.suppressPlayButton = true;

engine.start(loader);
