import {
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { BaseModal } from "./BaseModal";
import { ModalRemovePlsContext } from "../providers/ProviderModals";
import { ManagerWSContext, WsConnectContext } from "../providers/ProviderConnection";
import { ListPlsContext } from "../providers/ProviderLists";

const PlsItem = ({ item, playlistSelected, setPlaylistSelected }) => {
  const isSelected = playlistSelected === item.id ? true : false;
  if (item.id === 0) {
    return <></>;
  }
  return (
    <TouchableOpacity onPress={() => setPlaylistSelected(item.id)}>
      <Text
        key={`${item.id}2222${item.name}`}
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

export function ModalRemovePlaylist() {
  const { modalRemovePlsIsVisible, setModalRemovePlsIsVisible } = useContext(
    ModalRemovePlsContext
  );
  const wsConnected = useContext(WsConnectContext);
  const managerWS = useContext(ManagerWSContext);
  const { listPls } = useContext(ListPlsContext);

  const [plsSelected, setPlsSelected] = useState(-1);

  function resetSelect() {
    setPlsSelected(-1);
  }

  useEffect(() => {
    if (!modalRemovePlsIsVisible) {
      resetSelect();
    }
  }, [modalRemovePlsIsVisible]);

  function remove_playlist() {
    if (wsConnected && plsSelected > 0) {
      const namePlaylist = listPls.find((playlist) => {
        return playlist.id === plsSelected;
      }).name;

      Alert.alert(
        "Confirmación",
        `Desea eliminar la playlist \n"${namePlaylist}"`,
        [
          {
            text: "Sí",
            onPress: () => {
              managerWS.send("delete_playlist", { id: plsSelected });
              resetSelect();
              setModalRemovePlsIsVisible(false);
            },
          },
          {
            text: "No",
            onPress: () => {},
          },
        ]
      );
    } else if (!wsConnected) {
      ToastAndroid.show("Sin conexión establecida", ToastAndroid.SHORT);
    } else if (plsSelected <= 0) {
      ToastAndroid.show("Seleccione una playlist", ToastAndroid.SHORT);
    }
    // ToastAndroid.show(playlistSelected.toString(), ToastAndroid.SHORT);
  }

  //   const listPlaylists = [{id: 0,name: "Pls1"}, {id: 1, name: "Pls2"}, {id: 2, name: "Pls3"}, {id: 3, name: "Pls4"}];
  return (
    <BaseModal
      title={"Seleccione la playlist"}
      primaryButton={{ title: "Eliminar", onPress: remove_playlist }}
      isVisible={modalRemovePlsIsVisible}
      setIsVisible={setModalRemovePlsIsVisible}
    >
      <FlatList
        data={listPls}
        style={{ height: 70, width: "90%" }}
        renderItem={({ item }) => (
          <PlsItem
            item={item}
            playlistSelected={plsSelected}
            setPlaylistSelected={setPlsSelected}
          />
        )}
      />
    </BaseModal>
  );
}
