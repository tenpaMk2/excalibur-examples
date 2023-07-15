import { ImageSource } from "excalibur";

import fumiko from "./assets/Fumiko.png";
import bow from "./assets/Archer.png";
import enemy from "./assets/characters_packed.png";

export const Resources = {
  bowman: new ImageSource(fumiko),
  bow: new ImageSource(bow),
  enemy: new ImageSource(enemy),
};
