import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { mainTheme } from "./Palete";
import { useContext } from "react";
import { PlsSelectedContext } from "../providers/ProviderSelections";


export function PlaylistItem({ playlist }) {
  const { plsSelected, setPlsSelected } = useContext(PlsSelectedContext);
  let isSelected = false;
  if (playlist.id === plsSelected) {
    isSelected = true;
  }
  const selectedThisPlaylist = () => {
    setPlsSelected(playlist.id)
  }
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      marginVertical: 5,
      gap: 10,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 0.7,
      borderColor: isSelected ? mainTheme.FONT_COLOR : mainTheme.FONT_COLOR2,
      borderRadius: 10,
      padding: 10,
    },
    title: {
      color: mainTheme.FONT_COLOR,
      fontSize: 15,
      fontWeight: isSelected ? "400" : "200",
      textAlign: "center",
    },
  });
  return (
    <TouchableOpacity style={styles.container} onPress={selectedThisPlaylist}>
      <Text key={playlist.name} style={styles.title}>
        {playlist.name}
      </Text>
    </TouchableOpacity>
  );
}
