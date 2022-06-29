import { DisplayMode, Engine, Loader, Physics } from "excalibur";
import { Resources } from "./resource";
import { GameScene } from "./scenes/game-scene";

const engine = new Engine({
  width: 1920 / 2,
  height: 1080 / 2,
  displayMode: DisplayMode.FitScreen,
  canvasElementId: "game",
});

// engine.showDebug(true);
Physics.useRealisticPhysics();

engine.add("game-scene", new GameScene());
engine.goToScene("game-scene");

const loader = new Loader();
for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}

loader.suppressPlayButton = true;

engine.start(loader);
