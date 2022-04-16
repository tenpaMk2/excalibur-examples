import { ImageSource, Loader } from "excalibur";
import charaPng from "./assets/roguelikeChar_transparent.png";
import mapchipPng from "./assets/roguelikeSheet_transparent.png";

const Resources = {
  chara: new ImageSource(charaPng),
  mapchip: new ImageSource(mapchipPng),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export { Resources, loader };
