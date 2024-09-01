import { PlsModel } from "./PlsModel";
import { MusicModel } from "./MusicModel";

export class RequestModel {
  constructor(method = "", pls = PlsModel, music = MusicModel) {
    this.method = method;
    this.pls = pls;
    this.music = music;
  }
}