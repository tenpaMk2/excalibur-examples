import { ImageSource, Loader } from "excalibur";
import ballPng from "./assets/tenpamk2-ball.png";
import mapchipPng from "./assets/roguelikeSheet_transparent.png";

const Resources = {
  ball: new ImageSource(ballPng),
  mapchip: new ImageSource(mapchipPng),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export { Resources, loader };
