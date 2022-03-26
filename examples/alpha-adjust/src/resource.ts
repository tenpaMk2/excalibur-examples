import { ImageSource, Loader } from "excalibur";

const Resources = {
  pipo: new ImageSource("./assets/[Base]BaseChip_pipo.png"),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

loader.suppressPlayButton = true;

export { Resources, loader };
