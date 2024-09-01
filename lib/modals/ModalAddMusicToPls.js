import { useContext, useEffect, useState, Toucha, useCallback } from "react";
import { BaseModal } from "./BaseModal";
import { FlatList, TouchableOpacity, Text, ToastAndroid, VirtualizedList } from "react-native";
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
    <TouchableOpacity onPress={changeSelected} style={{height: 40, marginVertical: 5, backgroundColor: isSelected ? "lightgreen" : null, justifyContent: "center"}}>
      <Text
        key={`${item.id}111111${item.name}`}
        style={{textAlign: "center"}}
        numberOfLines={2}
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

  const getItemLayout = (data, index) => (
    {length: 50, offset: 50 * index, index: index}
  );

  const getItemCount = (data) => data.length;

  const getItem = (data, index) => data[index];

  const  resetSelect = useCallback(() => {
    setMusicsSelected([]);
  }, [])

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
      <VirtualizedList
        data={validListMusics}
        style={{ maxHeight: 400, width: "90%" }}
        renderItem={({ item }) => (
          <MusicItem
            item={item}
            musicsSelected={musicsSelected}
            setMusicsSelected={setMusicsSelected}
          />
        )}
        keyExtractor={(item) => `${item.id}111111${item.name}`}
        initialNumToRender={10}
        getItemLayout={getItemLayout}
        getItem={getItem}
        getItemCount={getItemCount}
      />
    </BaseModal>
  );
}
