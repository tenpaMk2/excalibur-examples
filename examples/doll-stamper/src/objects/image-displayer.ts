import { Actor, Canvas, Engine, Vector } from "excalibur";

export class ImageDisplayer {
  constructor(private engine: Engine, id: string) {
    document.querySelector(id)!.addEventListener("change", this.inputOnChange);
  }

  private inputOnChange = (event: Event) => {
    // https://qiita.com/simochee/items/b3d4dc15f474f805573c
    const { target } = event;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const file = target.files![0];
    if (!file) return;

    const reader = new FileReader(); // https://developer.mozilla.org/ja/docs/Web/API/FileReader
    reader.onload = this.readerOnLoad;
    reader.readAsDataURL(file);
  };

  private readerOnLoad = (event: ProgressEvent) => {
    const { target } = event;

    if (!(target instanceof FileReader)) {
      return;
    }

    const img = new Image(); // https://developer.mozilla.org/ja/docs/Web/API/HTMLImageElement/Image
    img.src = target.result as string; // https://developer.mozilla.org/ja/docs/Web/API/FileReader/result
    img.onload = this.imgOnload;
  };

  private imgOnload = (event: Event) => {
    const { target } = event;

    if (!(target instanceof HTMLImageElement)) {
      return;
    }

    const actor = new Actor({
      x: 0,
      y: 0,
      width: this.engine.drawWidth,
      height: this.engine.drawHeight,
      anchor: new Vector(0, 0),
    });

    const sourceRatio = target.height / target.width;
    const destinationRatio = actor.height / actor.width;
    const isFitVertical = destinationRatio < sourceRatio;

    const sourceWidth = isFitVertical
      ? target.width
      : target.height / destinationRatio;
    const sourceHeight = isFitVertical
      ? target.width * destinationRatio
      : target.height;
    const sourceX = isFitVertical ? 0 : (target.width - sourceWidth) / 2;
    const sourceY = isFitVertical ? (target.height - sourceHeight) / 2 : 0;

    this.engine.add(actor);
    const canvas = new Canvas({
      width: actor.width,
      height: actor.height,
      draw: (ctx) => {
        ctx.drawImage(
          target,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          actor.width,
          actor.height
        );
      },
    });

    actor.graphics.use(canvas);
  };
}
