export class MusicModel {
  constructor(id = 0, name = "", author = "", duration = "", URI = "") {
    this.id = id;
    this.name = name;
    this.author = author;
    this.duration = duration;
    this.URI = URI;
  }
}

export class MusicChangeModel {
  constructor(music = new MusicModel(), command = "") {
    this.music = music;
    this.command = command;
  }
}
