import { Audio } from "expo-av";
import { useState, useEffect, useContext, useRef } from "react";
import {
  MusicPlayingContext,
  PlayingMusicContext,
} from "../providers/ProviderProcesses";
import { createIconSetFromFontello } from "react-native-vector-icons";

const soundObject = new Audio.Sound();

export function Preview() {
  const { playingMusic, setPlayingMusic } = useContext(PlayingMusicContext);
  const { musicPlaying, setMusicPlaying } = useContext(MusicPlayingContext);
  const [player, setPlayer] = useState(new Player(setPlayingMusic));

  const [serverUrlFile, setServerUrlFile] = useState("");
  //   const [music, setMusic] = useState();

  useEffect(() => {
    player.loadMusic("http://192.168.1.9:8000/download/38");
  }, [musicPlaying]);

  useEffect(() => {
    if (playingMusic) {
      player.playMusic();
    } else {
      // player.pauseMusic()
    }
  }, [playingMusic]);

  //   useEffect(() => {
  //     return music && playingMusic
  //       ? () => {
  //           console.log('Unloading Music');
  //           music.unloadAsync();
  //         }
  //       : undefined;
  //   }, [music]);

  return <></>;
}


