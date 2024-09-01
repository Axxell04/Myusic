import { StyleSheet, View } from "react-native";
import { SectionConnection } from "../sections/SectionConnection";
import { SectionProcess } from "../sections/SectionProcess";
import { SectionHomePlaylist } from "../sections/SectionHomePlaylist";
import { SectionHomeMusics } from "../sections/SectionHomeMusics";
import { SectionPlayer } from "../sections/SectionPlayer";
import { SectionChanges } from "../sections/SectionChanges";
import { ModalYTContext } from "../providers/ProviderModals";
import { useContext } from "react";

export function ScreenMain() {
  const { modalYTIsVisible } = useContext(ModalYTContext);
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      flex: 1,
      overflow: "scroll",
      gap: 10,
      display: !modalYTIsVisible ? "flex" : "none",
    },
    topBar: {
      flexDirection: "row",
      gap: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <SectionConnection />
        <SectionProcess />
      </View>
      <SectionHomePlaylist />
      <SectionHomeMusics />
      <SectionPlayer />
      <SectionChanges />
    </View>
  );
}
