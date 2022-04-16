import { Loader } from "excalibur";

const Resources = {};

const loader = new Loader();

for (const res in Resources) {
  loader.addResource((Resources as any)[res]);
}

// loader.suppressPlayButton = true;

export { Resources, loader };
