import { Audio } from "expo-av";

export class Player {
  constructor() {
    const setAudiMode = async () => {
      await Audio.setAudioModeAsync({ staysActiveInBackground: true });
    };
    setAudiMode();
    this.sound = new Audio.Sound();
    this.playing = false;
    this.loading = false;
    this.loaded = false;
    this.setterPlayingMusic = null;
    this.setterMusicDuration = null;
    this.setterMusicPosition = null;
  }

  setSetterPlayingMusic(setter) {
    this.setterPlayingMusic = setter;
  }
  setSetterMusicDuration(setter) {
    this.setterMusicDuration = setter;
  }
  setSetterMusicPosition(setter) {
    this.setterMusicPosition = setter;
  }

  setPlayingMusic(value) {
    this.playMusic = value;
    this.setterPlayingMusic(value);
  }

  _onPlaybackStatusUpdate = async (playbackStatus) => {
    this.setterMusicPosition(playbackStatus.positionMillis);
    if (!playbackStatus.isLoaded) {
      this.setterMusicDuration(0);
      this.setterMusicPosition(0);
    }

    if (playbackStatus.didJustFinish) {
      await this.sound.pauseAsync();
      await this.sound.setPositionAsync(0);
      this.playing = false;
      this.setterPlayingMusic(false);
      this.setterMusicDuration(0);
      this.setterMusicPosition(0);
      console.log(playbackStatus);
    }
  };

  async loadMusic(url) {
    if (!this.loading) {
      if (this.loaded) {
        await this.sound.unloadAsync();
        this.loaded = false;
      }
      this.loading = true;
      await this.sound.loadAsync({ uri: url }, { shouldPlay: true });
      const status = await this.sound.getStatusAsync();
      console.log(status);
      this.setterMusicDuration(status.durationMillis);
      this.sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);

      await this.sound.setVolumeAsync(0.1);

      this.loading = false;
      this.loaded = true;
      this.playing = true;
      this.setterPlayingMusic(true);
      console.log("Music is loaded");
    }
  }

  async playMusic() {
    if (this.loading) {
      this.setterPlayingMusic(false);
    } else if (this.loaded) {
      console.log("Music Loaded: " + this.sound._loaded);
      console.log("Music Loading: " + this.sound._loading);
      await this.sound.playAsync();
      const sta = await this.sound.getStatusAsync();
      console.log(sta);
      this.playing = true;
      this.setterPlayingMusic(true);
    }
  }

  async pauseMusic() {
    if (this.playing && this.loaded) {
      await this.sound.pauseAsync();
      this.playing = false;
      this.setterPlayingMusic(false);
      console.log("Canción pausada");
    }
  }
}
