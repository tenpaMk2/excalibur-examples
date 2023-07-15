import { ImageSource, Loader } from "excalibur";
import pipoPng from "./assets/[Base]BaseChip_pipo.png";

const Resources = {
  pipo: new ImageSource(pipoPng),
};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

export { Resources, loader };
