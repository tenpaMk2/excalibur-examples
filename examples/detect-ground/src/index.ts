import { DisplayMode, Engine, Loader, Physics, Vector } from "excalibur";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: 1080 / 2,
  height: 1920 / 2,
  displayMode: DisplayMode.FitScreen,
});

// Physics.useRealisticPhysics();
Physics.gravity = Vector.Down.scale(300);

engine.showDebug(true);

engine.add("game-scene", new GameScene());
engine.goToScene("game-scene");

const loader = new Loader();
loader.suppressPlayButton = true;

engine.start(loader);
