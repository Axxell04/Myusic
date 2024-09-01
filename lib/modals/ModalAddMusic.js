import { useContext, useEffect, useState } from "react";
import { useURL } from "expo-linking";
import * as Clipboard from "expo-clipboard";
import { WebView } from "react-native-webview";
import { BaseModal } from "./BaseModal";

// import {
//   ConnectWsContext,
//   DownloadingContext,
//   ManagerWSContext,
//   ModalAddMusicContext,
// } from "../components/Context";
import { ToastAndroid } from "react-native";
import {
  ModalAddMusicContext,
  ModalYTContext,
} from "../providers/ProviderModals";
import { DownloadInProcessContext } from "../providers/ProviderProcesses";
import {
  ManagerWSContext,
  WsConnectContext,
} from "../providers/ProviderConnection";
import { YTURLIsValidContext } from "../providers/ProviderYT";

export function ModalAddMusic() {
  const { modalAddMusicIsVisible, setModalAddMusicIsVisible } =
    useContext(ModalAddMusicContext);
  const { modalYTIsVisible, setModalYTIsVisible } = useContext(ModalYTContext);
  const {setYTURLIsValid} = useContext(YTURLIsValidContext);
  const { downloadInProcess, setDownloadInProcess } = useContext(
    DownloadInProcessContext
  );
  const wsConnected = useContext(WsConnectContext);
  const managerWS = useContext(ManagerWSContext);
  const [urlMusic, setUrlMusic] = useState("");

  const urlLinking = useURL();

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

  const openModalYT = async () => {
    setModalYTIsVisible(true);
    setModalAddMusicIsVisible(false);
  };

  useEffect(() => {
    const listenerCopy = Clipboard.addClipboardListener(({ contentTypes }) => {
      console.log(contentTypes);
      if (contentTypes.includes(Clipboard.ContentType.PLAIN_TEXT)) {
        Clipboard.getStringAsync().then((content) => {
          console.log("Copiado: " + content);
          if (modalYTIsVisible || content.includes("youtube") || content.includes("youtu.be")) {
            setModalYTIsVisible(false);
            setModalAddMusicIsVisible(true);
            setUrlMusic(content);
          }
        });
      }
    });

    console.log(listenerCopy);

    return () => {
      Clipboard.removeClipboardListener(listenerCopy);
    };
  }, []);

  return (
    <>
      <BaseModal
        title={"Descargar \nCanción | Playlist"}
        textInput={{
          placeHolder: "Link de Youtube",
          valueTextInput: urlMusic,
          setValueTextInput: setUrlMusic,
        }}
        primaryButton={{ title: "Descargar", onPress: downloadMusic }}
        secondaryButton={{ title: "Buscar en YT", onPress: openModalYT }}
        isVisible={modalAddMusicIsVisible}
        setIsVisible={setModalAddMusicIsVisible}
      />
    </>
  );
}
