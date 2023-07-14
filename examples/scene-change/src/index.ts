import { Engine, Loader } from "excalibur";
import { Scene1 } from "./scenes/scene1";
import { Scene2 } from "./scenes/scene2";

const engine = new Engine({
  width: 1920 / 2,
  height: 1080 / 2,
});

engine.add("scene1", new Scene1());
engine.add("scene2", new Scene2());
engine.goToScene("scene1");

const loader = new Loader();

loader.suppressPlayButton = true;

engine.start(loader);
