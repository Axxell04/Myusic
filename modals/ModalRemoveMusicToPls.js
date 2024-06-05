import { useContext, useEffect, useState } from "react";
import { BaseModal } from "./BaseModal";
import {
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { ModalRemoveMusicToPlsContext } from "../providers/ProviderModals";
import {
  ManagerWSContext,
  WsConnectContext,
} from "../providers/ProviderConnection";
import {
  ListMusicsContext,
  ListTrackContext,
  TrackSelectedContext,
} from "../providers/ProviderLists";
import { PlsSelectedContext } from "../providers/ProviderSelections";
import TrackPlayer from "react-native-track-player";

const MusicItem = ({ item, musicsSelected, setMusicsSelected }) => {
  let isSelected = false;
  musicsSelected.map((music) => {
    if (music === item.id) {
      isSelected = true;
    }
  });

  function changeSelected() {
    if (isSelected) {
      const updateSelected = musicsSelected.filter((music) => {
        return music !== item.id;
      });
      setMusicsSelected(updateSelected);
    } else {
      setMusicsSelected([...musicsSelected, item.id]);
    }
  }

  return (
    <TouchableOpacity onPress={changeSelected}>
      <Text
        key={`${item.id}77777${item.name}`}
        style={{
          backgroundColor: isSelected ? "salmon" : null,
          textAlign: "center",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export function ModalRemoveMusicToPls() {
  const { modalRemoveMusicToPlsIsVisible, setModalRemoveMusicToPlsIsVisible } =
    useContext(ModalRemoveMusicToPlsContext);
  const wsConnected = useContext(WsConnectContext);
  const managerWS = useContext(ManagerWSContext);
  const { listMusics } = useContext(ListMusicsContext);
  const { listTrack } = useContext(ListTrackContext);
  const { plsSelected } = useContext(PlsSelectedContext);
  const {trackSelected} = useContext(TrackSelectedContext);

  const [musicsSelected, setMusicsSelected] = useState([]);
  const [validListMusics, setValidListMusics] = useState([]);

  function resetSelect() {
    setMusicsSelected([]);
  }

  //Filtrar la mista a mostrar para verificar que en ella no se encuentre la canción que se encuentra reproduciendose actualmente.
  
  const getActiveTrack = async () => {
    let activeTrack = await TrackPlayer.getActiveTrack();
    return activeTrack
  }

  useEffect(() => {
    setValidListMusics(
      listMusics.filter((music) => {
        let valid = true;
        
        if (trackSelected) {
          if (trackSelected.name === music.name) {
            valid = false;
          }
        }
        return valid;
      })
    );
  }, [trackSelected, listMusics]);
  
  useEffect(() => {
    if (trackSelected) {
      console.log(trackSelected.name)
    }
    console.log(validListMusics);
  }, [validListMusics])

  const removeMusic = () => {
    setModalRemoveMusicToPlsIsVisible(false);
    managerWS.send("remove_music_of_playlist", {
      playlist_id: plsSelected,
      musics_id: musicsSelected,
    });
    resetSelect();
  };

  useEffect(() => {
    if (!modalRemoveMusicToPlsIsVisible) {
      resetSelect();
    }
  }, [modalRemoveMusicToPlsIsVisible]);

  function removeToPls() {
    // ToastAndroid.show("Quitando canción", ToastAndroid.SHORT);
    if (wsConnected && musicsSelected.length > 0) {
      Alert.alert(
        "Confirmación",
        `¿Desea quitar ${musicsSelected.length} canciones?`,
        [
          {
            text: "Sí",
            onPress: () => removeMusic(),
          },
          {
            text: "No",
            onPress: () => {},
          },
        ]
      );
    } else if (!wsConnected) {
      ToastAndroid.show("Sin conexión establecida", ToastAndroid.SHORT);
    } else if (musicsSelected.length === 0) {
      ToastAndroid.show("Seleccione las canciones", ToastAndroid.SHORT);
    }
  }

  return (
    <BaseModal
      title={
        plsSelected === 0
          ? "Quitar canción del sistema"
          : "Quitar canción de la playlist"
      }
      isVisible={modalRemoveMusicToPlsIsVisible}
      setIsVisible={setModalRemoveMusicToPlsIsVisible}
      primaryButton={{
        title: "Quitar",
        onPress: removeToPls,
      }}
    >
      <FlatList
        data={validListMusics}
        style={{ maxHeight: 400, width: "90%" }}
        renderItem={({ item }) => (
          <MusicItem
            item={item}
            musicsSelected={musicsSelected}
            setMusicsSelected={setMusicsSelected}
          />
        )}
      />
    </BaseModal>
  );
}
