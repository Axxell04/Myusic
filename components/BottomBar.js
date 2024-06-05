import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { mainTheme } from "./Palete";
import { useContext } from "react";
import { ModalAddMusicContext } from "../providers/ProviderModals";

export function BottomBar() {
  const { modalAddMusicIsVisible, setModalAddMusicIsVisible } =
    useContext(ModalAddMusicContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => setModalAddMusicIsVisible(true)}
      >
        <Icon name="plus" size={45} style={styles.plus} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: mainTheme.SECONDARY_COLOR,
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: mainTheme.FONT_COLOR2,
  },
  plus: {
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
});
