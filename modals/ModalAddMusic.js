import { useContext, useEffect, useState } from "react";
import { useURL } from "expo-linking";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
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

  const urlLinking = useURL()

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

  const openWebBrowser = async () => {
    const initCopy = await Clipboard.getStringAsync()
  
    let result = await WebBrowser.openAuthSessionAsync("https://axxell04.github.io/redirect-yt/")
    
    if (result.type === WebBrowser.WebBrowserResultType.DISMISS) {
      console.log("El browser fue cerrado")
      await new Promise(resolve => setTimeout(resolve, 500));
      const actualCopy = await Clipboard.getStringAsync({})
      // console.log("initCopy: "+initCopy);
      // console.log("actualCopy: "+actualCopy);

      if (actualCopy != initCopy) {
        console.log("Se ha copiado un nuevo link");
        ToastAndroid.show("Nuevo link detectado", ToastAndroid.SHORT);
        setUrlMusic(actualCopy);
        // setModalAddMusicIsVisible(true);
      }

    }
  }

  useEffect(() => {
    console.log("URL_LINKING: "+urlLinking)
  }, [urlLinking])

  return (
    <BaseModal
      title={"Descargar \nCanción | Playlist"}
      textInput={{
        placeHolder: "Link de Youtube",
        valueTextInput: urlMusic,
        setValueTextInput: setUrlMusic,
      }}
      primaryButton={{ title: "Descargar", onPress: downloadMusic }}
      secondaryButton={{title: "Buscar en YT", onPress: openWebBrowser}}
      isVisible={modalAddMusicIsVisible}
      setIsVisible={setModalAddMusicIsVisible}
    />
  );
}
