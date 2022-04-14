import { ImageSource, Loader } from "excalibur";
import ballPng from "./assets/tenpamk2-ball.png";

const Resources = {
  ball: new ImageSource(ballPng),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export { Resources, loader };
