import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { mainTheme } from "../components/Palete";
import { Icon } from "react-native-vector-icons/AntDesign";
import { BaseModal } from "./BaseModal";
import { useContext, useState } from "react";
import { ModalCreatePlsContext } from "../providers/ProviderModals";
import { ManagerWSContext, WsConnectContext } from "../providers/ProviderConnection";

export function ModalCreatePlaylist() {
  const { modalCreatePlsIsVisible, setModalCreatePlsIsVisible } = useContext(
    ModalCreatePlsContext
  );
  const wsConnected = useContext(WsConnectContext);
  const managerWS = useContext(ManagerWSContext);

  const [namePlaylist, setNamePlaylist] = useState("");

  function createPlaylist() {
    if (wsConnected && namePlaylist) {
      managerWS.send("create_playlist", { name: namePlaylist.trim() });
      setNamePlaylist("");
      setModalCreatePlsIsVisible(false);
    } else if (!wsConnected) {
      ToastAndroid.show("Sin conexión establecida", ToastAndroid.SHORT);
    } else if (!namePlaylist) {
      ToastAndroid.show("Ingrese un nombre", ToastAndroid.SHORT);
    }
  }
  return (
    <BaseModal
      title={"Nueva Playlist"}
      textInput={{
        placeHolder: "Nombre de la Playlist",
        valueTextInput: namePlaylist,
        setValueTextInput: setNamePlaylist,
      }}
      primaryButton={{ title: "Crear", onPress: createPlaylist }}
      isVisible={modalCreatePlsIsVisible}
      setIsVisible={setModalCreatePlsIsVisible}
    />
  );
}
