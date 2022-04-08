import { ImageSource, Loader } from "excalibur";

const Resources = {
  chara: new ImageSource("./assets/roguelikeChar_transparent.png"),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export { Resources, loader };
