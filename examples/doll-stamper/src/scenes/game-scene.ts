import { Engine, Scene } from "excalibur";
import { ImageDisplayer } from "../objects/image-displayer";
import { Spawner } from "../objects/spawner";

export class GameScene extends Scene {
  onInitialize(engine: Engine): void {
    new ImageDisplayer(engine, "#input");

    new Spawner(engine);

    const button = document.getElementById("screenshot")! as HTMLInputElement;
    button.onclick = async (_event: Event) => {
      const screenshot = await engine.screenshot();
      document.body.insertBefore(screenshot, button);
    };
  }
}
