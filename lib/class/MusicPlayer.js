import { useContext, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import TrackPlayer, {
  Capability,
  State,
  Event,
  useTrackPlayerEvents
} from "react-native-track-player";
import { PlayingMusicContext } from "../providers/ProviderProcesses";
import {
  ListMusicsContext,
  ListTrackContext,
  TrackSelectedContext,
} from "../providers/ProviderLists";
import { IpServerContext, WsConnectContext } from "../providers/ProviderConnection";
import {
  ActiveMusicAuthorContext,
  ActiveMusicTitleContext,
} from "../providers/ProviderSelections";

export function MusicPlayer() {
  const wsConnected = useContext(WsConnectContext);
  const { setPlayingMusic } = useContext(PlayingMusicContext);

  const { listTrack } = useContext(ListTrackContext);
  const { trackSelected, setTrackSelected } = useContext(TrackSelectedContext);
  const [trackSelectedPlaying, setTrackSelectedPlaying] = useState(false);
  const { ipServer } = useContext(IpServerContext);
  const { setActiveMusicTitle } = useContext(ActiveMusicTitleContext);
  const { setActiveMusicAuthor } = useContext(ActiveMusicAuthorContext);

  const [playerInit, setPlayerInit] = useState(false);
  useEffect(() => {
    //console.log("Player Init: " + playerInit)
  }, [playerInit])

  let trackListMusics = [];

  const initPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer({autoHandleInterruptions: true});
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
      setPlayerInit(true);
    } catch (error) {
      if (error.message === "The player has already been initialized via setupPlayer.") {
        setPlayerInit(true);
      }
    }
  };
  const getIndexOfMusic = async () => {
    // Obtiene el ínidice del track equivalente al objeto music que se encuetra seleccionado actualmente "trackSelected"
    if (!playerInit) {
      return null;
    }
    const index = (await TrackPlayer.getQueue()).findIndex((track) => {
      if (
        track.artist === trackSelected.author &&
        track.title === trackSelected.name
      ) {
        return true;
      }
    });
    return index;
  };
  const updateTrackMusics = async () => {
    if (!playerInit) {
      return null;
    }
    try {
      trackListMusics = [];
      listTrack.map((music) => {
        const uri = wsConnected ? `http://${ipServer}:8000/download/${music.id}` : music.uri
        //console.log(uri)
        trackListMusics.push({
          url: uri,
          title: music.name,
          artist: music.author,
        });
      });
      await TrackPlayer.reset();
      await TrackPlayer.add(trackListMusics);
      await changeTrackPlaying();
    } catch (error) {
      console.log(error);
    }
  };
  const changeTrackPlaying = async () => {
    if (!playerInit) {
      return null;
    }
    if (!trackSelectedPlaying) {
      await TrackPlayer.skip(await getIndexOfMusic());
    }
    await TrackPlayer.play();
    await updateInfo();
    setTrackSelectedPlaying(false);
  };
  const updateInfo = async () => {
    const activeTrack = await TrackPlayer.getActiveTrack();
    setActiveMusicAuthor(activeTrack.artist);
    setActiveMusicTitle(activeTrack.title);
  };
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state === State.Playing) {
      setPlayingMusic(true);
    } else if (event.state === State.Paused) {
      setPlayingMusic(false);
    } else if (event.state === State.Ready) {
      // if (!trackSelectedPlaying) {
      //   const indexLoaded = await TrackPlayer.getActiveTrackIndex();
      //   console.log("IndexLoaded: " + indexLoaded);
      //   await TrackPlayer.play();
      // }
    } else if (event.state === State.Ended) {
      setPlayingMusic(false);
      await TrackPlayer.pause();
      await TrackPlayer.seekTo(0);
    }
  });
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    //Si el índice de la canción que comenzó a reproducirse es la siguiente a la última que se indicó que se encontraba reproduciendo actualizar este estado asignando un nuevo objeto music a trackSeleccted
    if (event.index === (await getIndexOfMusic()) + 1) {
      setTrackSelectedPlaying(true);
      setTrackSelected(
        listTrack[
          listTrack.findIndex((music) => {
            return music === trackSelected;
          }) + 1
        ]
      );
    } else if (event.index === (await getIndexOfMusic()) - 1) {
      setTrackSelectedPlaying(true);
      setTrackSelected(
        listTrack[
          listTrack.findIndex((music) => {
            return music === trackSelected;
          }) - 1
        ]
      );
    }
  });

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async (event) => {
    setTrackSelected(listTrack[0]);
  })

  useEffect(() => {
    initPlayer();
  }, []);
  useEffect(() => {
    updateTrackMusics();
  }, [listTrack]);
  useEffect(() => {
    const validate = async () => {
      if ((await getIndexOfMusic()) !== -1) {
        changeTrackPlaying();
      }
    };
    validate();
  }, [trackSelected]);

  return <></>;
}
