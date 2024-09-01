import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/AntDesign";
import { mainTheme } from "./Palete";
import { useContext } from "react";
import {
  ModalAddMusicContext,
  ModalYTContext,
} from "../providers/ProviderModals";
import { YTURLContext, YTURLIsValidContext } from "../providers/ProviderYT";

export function BottomBar() {
  const { modalAddMusicIsVisible, setModalAddMusicIsVisible } =
    useContext(ModalAddMusicContext);
  const { modalYTIsVisible, setModalYTIsVisible } = useContext(ModalYTContext);
  const { ytURL } = useContext(YTURLContext);
  const { ytURLIsValid } = useContext(YTURLIsValidContext);

  function closeModalYT() {
    setModalYTIsVisible(false);
  }

  async function selectYTURL() {
    await Clipboard.setStringAsync(ytURL);
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: mainTheme.SECONDARY_COLOR,
      width: "100%",
      height: 60,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: mainTheme.FONT_COLOR2,
    },
    icon: {
      alignSelf: "center",
      textAlign: "center",
      borderWidth: 2,
      borderRadius: 50,
      borderColor: mainTheme.FONT_COLOR2,
      color: mainTheme.FONT_COLOR,
    },

    touchable: {
      alignItems: "center",
      padding: 5,
    },
    optButtons: {
      padding: 5,
      borderWidth: 1,
      borderColor: mainTheme.FONT_COLOR2,
      borderRadius: 15,
      width: 100,
      alignItems: "center",
      justifyContent: "center",
      display: ytURLIsValid && modalYTIsVisible ? "flex" : "none",
    },
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optButtons} onPress={closeModalYT}>
        <Text style={{ color: mainTheme.FONT_COLOR }}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setModalAddMusicIsVisible(true)}
      >
        <Icon name="plus" size={45} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optButtons, { backgroundColor: mainTheme.FONT_COLOR }]}
        onPress={selectYTURL}
      >
        <Text style={{ color: mainTheme.SECONDARY_COLOR }}>Seleccionar</Text>
      </TouchableOpacity>
    </View>
  );
}
