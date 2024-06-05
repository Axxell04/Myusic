import { useContext, useState } from "react";
import { BaseModal } from "./BaseModal";
// import {
//   ConnectWsContext,
//   DownloadingContext,
//   ManagerWSContext,
//   ModalAddMusicContext,
// } from "../components/Context";
import { ToastAndroid } from "react-native";
import { ModalAddMusicContext } from "../providers/ProviderModals";
import { DownloadInProcessContext } from "../providers/ProviderProcesses";
import { ManagerWSContext, WsConnectContext } from "../providers/ProviderConnection";

export function ModalAddMusic() {
  const { modalAddMusicIsVisible, setModalAddMusicIsVisible } =
    useContext(ModalAddMusicContext);
  const { downloadInProcess, setDownloadInProcess } = useContext(
    DownloadInProcessContext
  );
  const wsConnected = useContext(WsConnectContext);
  const managerWS = useContext(ManagerWSContext);
  const [urlMusic, setUrlMusic] = useState("");

  const downloadMusic = () => {
    if (wsConnected && !downloadInProcess && urlMusic) {
      managerWS.send("download", urlMusic.trim());
      setDownloadInProcess(true);
      setUrlMusic("");
      setModalAddMusicIsVisible(false);
      ToastAndroid.show("Descargando...", ToastAndroid.SHORT);
    } else if (!wsConnected) {
      ToastAndroid.show("Sin conexión establecida", ToastAndroid.SHORT);
    } else if (downloadInProcess) {
      ToastAndroid.show("Descarga en curso", ToastAndroid.SHORT);
    } else if (!urlMusic) {
      ToastAndroid.show("Ingrese la URL", ToastAndroid.SHORT);
    }
  };

  return (
    <BaseModal
      title={"Descargar \nCanción | Playlist"}
      textInput={{
        placeHolder: "Link de Youtube",
        valueTextInput: urlMusic,
        setValueTextInput: setUrlMusic,
      }}
      primaryButton={{ title: "Descargar", onPress: downloadMusic }}
      isVisible={modalAddMusicIsVisible}
      setIsVisible={setModalAddMusicIsVisible}
    />
  );
}
