import { StyleSheet, View } from "react-native";
import { SectionConnection } from "../components/SectionConnection";
import { SectionProcess } from "../components/SectionProcess";
import { SectionHomePlaylist } from "../components/SectionHomePlaylist";
import { SectionHomeMusics } from "../components/SectionHomeMusics";
import { SectionPlayer } from "../components/SectionPlayer";
import { SectionChanges } from "../components/SectionChanges";
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
