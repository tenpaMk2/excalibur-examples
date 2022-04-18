import { ImageSource, Loader } from "excalibur";
import ballPng from "./assets/tenpamk2-ball.png";
import missilePng from "./assets/tenpamk2-missile.png";

const Resources = {
  ball: new ImageSource(ballPng),
  missile: new ImageSource(missilePng),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export { Resources, loader };
