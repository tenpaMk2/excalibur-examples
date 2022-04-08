import { ImageSource, Loader } from "excalibur";
import charaPng from "./assets/roguelikeChar_transparent.png";

const Resources = {
  chara: new ImageSource(charaPng),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export { Resources, loader };
