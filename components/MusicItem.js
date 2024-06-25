import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { mainTheme } from "./Palete";
import Icon from "react-native-vector-icons/AntDesign";
import { act, memo, useCallback, useContext, useEffect, useState } from "react";
import { PlayerContext } from "../providers/ProviderProcesses";
import {
  IpServerContext,
  WsConnectContext,
} from "../providers/ProviderConnection";
import TrackPlayer from "react-native-track-player";
import {
  ListLocalMusicsContext,
  ListMusicsContext,
  ListTrackContext,
  TrackSelectedContext,
} from "../providers/ProviderLists";
import {
  IdListTrackContext,
  PlsSelectedContext,
} from "../providers/ProviderSelections";
import { ListChangesContext } from "../providers/ProviderChanges";
import { MusicChangeModel, MusicModel } from "../models/MusicModel";

const MusicItemInfo = memo(({music}) => {
  const styles = StyleSheet.create({
    section1_1: {
      flexDirection: "row",
      overflow: "scroll",
      alignItems: "center",
    },
    title: {
      color: mainTheme.FONT_COLOR,
      height: 22,
      fontSize: 15,
      fontWeight: "300",
    },
    author: {
      height: 21,
      flex: 0.8,
      paddingRight: 5,
      color: mainTheme.FONT_COLOR2,
      fontWeight: "300",    

    },
    duration: {
      flex: 0.2,
      borderBottomWidth: 0.5,
      paddingHorizontal: 5,
      textAlign: "center",
      color: mainTheme.FONT_COLOR2,
      borderBottomColor: mainTheme.FONT_COLOR,
      fontWeight: "300",
    },
  });
  const formatDuration = useCallback((duration) => {
    const arrayDuration = duration.split(":");
    const h = arrayDuration[0];
    const m = arrayDuration[1];
    const s = arrayDuration[2];

    if (h === "00") {
      return `${m}:${s}`;
    } else {
      return duration;
    }
  }, []);
  console.log(music);
  return (
    <>
    <Text key={music.path} style={styles.title} numberOfLines={1} ellipsizeMode="tail">
      {music.name}
    </Text>
    <View style={styles.section1_1}>
      <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">{music.author}</Text>
      <Text style={styles.duration}>{formatDuration(music.duration)}</Text>
    </View>
    </>
  )
})

//MUSIC ITEM ICON SYNC
const MusicItemIconSync = memo(({actualSyncState}) => {
  const styles = StyleSheet.create({
    icon: {
      color: mainTheme.FONT_COLOR,
      textAlign: "center",
    },
  });
  console.log("ActualSyncState: "+actualSyncState)
  return (
    <Icon
      name={actualSyncState ? "checkcircle" : "checkcircleo"}
      size={30}
      style={styles.icon}
    />
  )
})

export function MusicItem({ music }) {
  //##EL ITEM SE ESTÁ VOLVIENDO A RENDERIZAR ANQUE SU CONTENIDO "ESTÁTICO" QUE SE MUESTRA EN PANTALLA COMO NOMBRE, AUTOR Y DURACIÓN CON CAMBIA
  //** CREAR OTRO COMPONENTE HIJO AL QUE SOLO SE LE PASARÁ LA INFORMACIÓN ESTÁTICA COMO NOMBRE Y DEMÁS, EL CUAL SERÁ QUIEN SE RENDERIZARÁ REALMENTE 
  //console.log(music)
  //WS CONNECTED
  const wsConnected = useContext(WsConnectContext);

  //LIST LOCAL ##OPTIMIZAR
  const { listLocalMusics } = useContext(ListLocalMusicsContext);

  //SYNC STATE
  const [initSyncState, setInitSyncState] = useState(false);
  const [actualSyncState, setActualSyncState] = useState(initSyncState);

  //LIST MUSIC CHANGES
  const { listChanges, setListChanges } = useContext(ListChangesContext);

  const { plsSelected } = useContext(PlsSelectedContext);
  const { listMusics } = useContext(ListMusicsContext);
  const { setListTrack } = useContext(ListTrackContext);
  const { setIdListTrack } = useContext(IdListTrackContext);
  const { setTrackSelected } = useContext(TrackSelectedContext);

  

  const getIndexOfMusic = async () => {
    const index = (await TrackPlayer.getQueue()).findIndex((track) => {
      if (track.artist === music.author && track.title === music.name) {
        return true;
      }
    });
    return index;
  };

  const changeListTrack = () => {
    if (wsConnected) {
      setListTrack(listMusics);
    } else {
      setListTrack(listLocalMusics)
    }
  };

  //##ENVIAR ESTE MÉTODO AL HIJO, SIN CAER EN RE-RENDERIZADOS INNECESARIOS
  //** HACER QUE EL TOCHABLEOPACITY PERTENEZCA AL PADRE Y PINTAR AL HIJO DENTRO, ASÍ EL EVENTO SEGUIRÁ PERTENECIENDO AL PADRE SIN NECESIDAD DE RE-RENDERIZAR AL HIJO
  const playMusic = () => {
    setTrackSelected(music);
    changeListTrack();
    setIdListTrack(plsSelected);
  };

  //const [indexMusic, setIndexMusic] = useState(getIndexOfMusic());

  const changeSyncState = () => {
    if (initSyncState != !actualSyncState) {
      const command = !actualSyncState ? "sync" : "desync";
      setListChanges([
        ...listChanges,
        new MusicChangeModel(
          new MusicModel(music.id, music.name, music.author, music.duration),
          command
        ),
      ]);
    } else {
      setListChanges(
        listChanges.filter((musicChange) => {
          return musicChange.music.id != music.id;
        })
      );
    }
    setActualSyncState(!actualSyncState);
  };

  useEffect(() => {
    const itemMusicChange = listChanges.find((musicChange) => {
      return musicChange.music.id === music.id;
    })
    if (!itemMusicChange) {
      setActualSyncState(initSyncState);
    }
  }, [listChanges])

  useEffect(() => {
    listLocalMusics.find((musicLocal) => {
      if (musicLocal.id === music.id) {
        setInitSyncState(true);
        return true;
      } else {
        setInitSyncState(false);
      }
    });
    if (listLocalMusics.length === 0) {
      setInitSyncState(false);
    }
  }, [listLocalMusics]);

  useEffect(() => {
    setActualSyncState(initSyncState);
  }, [initSyncState]);
  //STYLES
  const styles = StyleSheet.create({
    container: {
      maxHeight: 70,
      minHeight: 70,
      flexDirection: "row",
      marginVertical: 5,
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    section1: {
      height: "100%",
      flex: 1,
      borderWidth: 0.7,
      borderColor: mainTheme.FONT_COLOR2,
      padding: 10,
      gap: 5,
      borderRadius: 10,
    },
    section2: {
      display: (plsSelected != 0 && wsConnected) ? "flex" : "none",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
    },
  });


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.section1} onPress={() => playMusic()}>
        <MusicItemInfo music={music} />
      </TouchableOpacity>
      <TouchableOpacity
          style={styles.section2}
          onPress={() => changeSyncState()}
        >
          <MusicItemIconSync actualSyncState={actualSyncState} />
        </TouchableOpacity>
    </View>
  );
}

