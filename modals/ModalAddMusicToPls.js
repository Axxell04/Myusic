import { useContext, useEffect, useState, Toucha } from "react";
import { BaseModal } from "./BaseModal";
import { FlatList, TouchableOpacity, Text, ToastAndroid } from "react-native";
import { ModalAddMusicToPlsContext } from "../providers/ProviderModals";
import { ManagerWSContext, WsConnectContext } from "../providers/ProviderConnection";
import { ListMusicsContext } from "../providers/ProviderLists";
import { PlsSelectedContext } from "../providers/ProviderSelections";

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
        key={`${item.id}111111${item.name}`}
        style={{
          backgroundColor: isSelected ? "lightgreen" : null,
          textAlign: "center",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export function ModalAddMusicToPls() {
  const { modalAddMusicToPlsIsVisible, setModalAddMusicToPlsIsVisible } = useContext(
    ModalAddMusicToPlsContext
  );
  const wsConnected = useContext(WsConnectContext);
  const managerWS = useContext(ManagerWSContext);
  const { listMusics } = useContext(ListMusicsContext);
  const { plsSelected } = useContext(PlsSelectedContext);

  const [listAllMusics, setListAllMusics] = useState([]);
  const [validListMusics, setValidListMusics] = useState([]);
  const [musicsSelected, setMusicsSelected] = useState([]);

  function resetSelect() {
    setMusicsSelected([]);
  }

  useEffect(() => {
    if (!modalAddMusicToPlsIsVisible) {
      resetSelect();
    } else {
      if (wsConnected) {
        managerWS.send("get_musics", { all: true }, setListAllMusics);
      }
    }
  }, [modalAddMusicToPlsIsVisible]);

  useEffect(() => {
    if (listAllMusics.length > 0) {
      setValidListMusics(
        listAllMusics.filter((music) => {
          let valid = true
          listMusics.map((musicInPlaylist) => {
            if (music.id === musicInPlaylist.id) {
              valid =  false;
            }
          });
          return valid;
        })
      );
    }
  }, [listAllMusics]);

  function addMusicToPls() {
    if (wsConnected && musicsSelected.length > 0) {
      managerWS.send("add_musics_to_playlist", {
        musics_id: musicsSelected,
        playlist_id: plsSelected,
      });
      resetSelect();
      setModalAddMusicToPlsIsVisible(false);
    } else if (!wsConnected) {
      ToastAndroid.show("Sin conexión establecida", ToastAndroid.SHORT);
    } else if (musicsSelected.length === 0) {
      ToastAndroid.show("Seleccione las canciones", ToastAndroid.SHORT);
    }
  }

  return (
    <BaseModal
      title={"Agregar canción a la playlist"}
      isVisible={modalAddMusicToPlsIsVisible}
      setIsVisible={setModalAddMusicToPlsIsVisible}
      primaryButton={{
        title: "Agregar",
        onPress: addMusicToPls,
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
