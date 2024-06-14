import { createContext, useContext, useState } from "react";
import { BaseModal } from "./BaseModal";
import { ModalConnectContext } from "../providers/ProviderModals";
import { TextInput, ToastAndroid } from "react-native";
import {
  IpServerContext,
  ManagerWSContext,
  WsConnectContext,
} from "../providers/ProviderConnection";

export function ModalConnect() {
  const { modalConnectIsVisible, setModalConnectIsVisible } =
    useContext(ModalConnectContext);
  const wsConnected = useContext(WsConnectContext);
  const { ipServer, setIpServer } = useContext(IpServerContext);
  const managerWS = useContext(ManagerWSContext);

  const [inputText, setInputText] = useState("");

  function enterNewIp() {
    if (!wsConnected && inputText) {
      ToastAndroid.show("Conectando...", ToastAndroid.SHORT);
      setIpServer(inputText.trim());
      managerWS.setIpServer(inputText.trim());
      managerWS.connect();
    } else if (wsConnected) {
      ToastAndroid.show("Conexión ya establecida", ToastAndroid.SHORT);
    } else if (!inputText) {
      ToastAndroid.show("Ingrese la IP", ToastAndroid.SHORT);
    }
  }

  function disconnect() {
    if (wsConnected) {
      managerWS.disconnect();
    } else {
      ToastAndroid.show("Sin conexión establecida", ToastAndroid.SHORT);
    }
  }

  const filterInput = (text = "") => {
    const forbiddenCharacters = [
      " ",
      "#",
      "?",
      "%",
      "&",
      ",",
      "/",
      ":",
      "@",
      "=",
      "+",
      "$",
      "*",
      "(",
      ")",
      "[",
      "]",
      "|",
      "\\",
      '"',
      "'",
      "<",
      ">",
      "^",
    ];

    forbiddenCharacters.map((char) => {
      text = text.replace(char, "");
    });

    setInputText(text);
  };

  return (
    <BaseModal
      title={"Conectar al servidor"}
      isVisible={modalConnectIsVisible}
      setIsVisible={setModalConnectIsVisible}
      primaryButton={{
        title: "Conectar",
        onPress: enterNewIp,
      }}
      secondaryButton={{
        title: "Desconectar",
        onPress: disconnect,
      }}
    >
      <TextInput
        style={{
          borderBottomWidth: 1,
          paddingVertical: 4,
          paddingHorizontal: 10,
          width: "90%",
          textAlign: "center",
        }}
        placeholder="Ingrese la IP del servidor"
        value={inputText}
        onChangeText={(text) => filterInput(text)}
      />
    </BaseModal>
  );
}
