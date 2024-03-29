import { Scene, Engine, Random, SceneActivationContext } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input/PointerEvent";
import { Clone } from "../objects/clone";
import { Original } from "../objects/original";
import { Score } from "../objects/score";

interface GameSceneInterface {
  initialize(): void; 
}

export class GameScene extends Scene<GameSceneInterface> {
  original!: Original;
  clone!: Clone;
  score!: Score;
  hasClicked: Boolean = false;

  onInitialize = (_engine: Engine) => {};

  initialize = () => {
    if (this.original) {
      this.original.kill();
    }
    if (this.clone) {
      this.clone.kill();
    }
    if (this.score) {
      this.score.kill();
    }
    this.hasClicked = false;
    // @ts-ignore
    this.engine.input.pointers.primary.off("down");
  };

  onActivate(_ctx: SceneActivationContext<GameSceneInterface>) {
    this.initialize();

    this.original = new Original(
      this.engine.halfDrawWidth,
      (this.engine.drawHeight * 3) / 4,
      new Random().next()
    );
    this.engine.add(this.original);

    this.clone = new Clone(
      this.engine.halfDrawWidth,
      (this.engine.drawHeight * 1) / 4,
      0.3
    );
    this.engine.add(this.clone);

    // Inputs
    this.engine.input.pointers.primary.on(
      // @ts-ignore
      "down",
      (_event: PointerEvent) => {
        if (!this.hasClicked) {
          this.hasClicked = true;

          this.clone.isFreezed = true;

          const diff = Math.abs(
            this.original.graphics.opacity - this.clone.graphics.opacity
          );

          this.score = new Score(
            this.engine.halfDrawWidth,
            this.engine.halfDrawHeight,
            diff
          );
          this.engine.add(this.score);
        } else {
          this.hasClicked = false;
          this.engine.goToScene("game-scene");
        }
      }
    );
  }
}
