import { Scene, Engine, SpriteSheet, TileMap, Vector, Sprite } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Player } from "../objects/player";
import { Resources } from "../resource";

export class GameScene extends Scene {
  static readonly UNIT_LENGTH = 64;

  constructor(public engine: Engine) {
    super();
  }

  onInitialize = (engine: Engine) => {
    const mapchipSpriteSheet = SpriteSheet.fromImageSource({
      image: Resources.mapchip,
      grid: {
        rows: 31,
        columns: 57,
        spriteHeight: 16,
        spriteWidth: 16,
      },
      spacing: {
        margin: {
          x: 1,
          y: 1,
        },
      },
    });

    const tilemap = new TileMap({
      x: 0,
      y: 0,
      rows: 10,
      cols: 8,
      cellWidth: GameScene.UNIT_LENGTH,
      cellHeight: GameScene.UNIT_LENGTH,
    });
    engine.add(tilemap);

    for (let row = 0; row < tilemap.rows; row++) {
      for (let col = 0; col < tilemap.cols; col++) {
        let sprite: Sprite;

        const cell = tilemap.getCell(col, row);
        if (
          row === 0 ||
          row === tilemap.rows - 1 ||
          col === 0 ||
          col === tilemap.cols - 1
        ) {
          sprite = mapchipSpriteSheet.getSprite(6, 0);
          cell.data.set("isBlocked", true);
        } else {
          sprite = mapchipSpriteSheet.getSprite(5, 0);
          cell.data.set("isBlocked", false);
        }

        sprite.width = cell.width;
        sprite.height = cell.height;
        cell.addGraphic(sprite);
      }
    }

    const cell = tilemap.getCell(2, 3);
    const player = new Player(cell.center, GameScene.UNIT_LENGTH);
    engine.add(player);

    engine.input.pointers.primary.on("down", (event: PointerEvent) => {
      if (event.screenPos.x < engine.drawWidth / 4) {
        this.tryToMoveLeft(tilemap, player);
      } else if ((engine.drawWidth * 3) / 4 < event.screenPos.x) {
        this.tryToMoveRight(tilemap, player);
      }

      if (event.screenPos.y < engine.drawHeight / 4) {
        this.tryToMoveUp(tilemap, player);
      } else if ((engine.drawHeight * 3) / 4 < event.screenPos.y) {
        this.tryToMoveDown(tilemap, player);
      }
    });
  };

  tryToMoveUp = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Up);
  };

  tryToMoveRight = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Right);
  };

  tryToMoveDown = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Down);
  };

  tryToMoveLeft = (tilemap: TileMap, player: Player) => {
    this.tryToMove(tilemap, player, Vector.Left);
  };

  tryToMove = (tilemap: TileMap, player: Player, directionVector: Vector) => {
    const pos = player.pos;
    const targetPos = pos.add(directionVector.scale(GameScene.UNIT_LENGTH));
    const targetCell = tilemap.getCellByPoint(targetPos.x, targetPos.y);
    const isBlocked = targetCell.data.get("isBlocked");
    if (isBlocked) return;
    player.pos = targetPos;
  };
}
