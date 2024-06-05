import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { mainTheme } from "./Palete";
import { useContext, useEffect, useRef } from "react";
import { PlaylistItem } from "./PlaylistItem";
import Icon from "react-native-vector-icons/FontAwesome6";
import { ListPlsContext } from "../providers/ProviderLists";
import { PlsSelectedContext } from "../providers/ProviderSelections";
import { ModalCreatePlsContext, ModalRemovePlsContext } from "../providers/ProviderModals";

export function SectionHomePlaylist() {
  const { listPls } = useContext(ListPlsContext);
  const { setPlsSelected } = useContext(PlsSelectedContext);
  const {setModalCreatePlsIsVisible} = useContext(ModalCreatePlsContext);
  const {setModalRemovePlsIsVisible} = useContext(ModalRemovePlsContext)

  const playlistFlatListRef = useRef(null);

  const scrollToInit = () => {
    playlistFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  useEffect(() => {
    if (listPls.length > 1) {
      setPlsSelected(0);
      scrollToInit();
    }
  }, [listPls]);

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.titleNum}>{listPls.length}</Text>
        <Text style={styles.titleText}> Playlists </Text>
        <View style={styles.titleSectionOptions}>
          <TouchableOpacity onPress={() => setModalCreatePlsIsVisible(true)}>
            <Icon name="folder-plus" style={styles.optionIcon}  />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalRemovePlsIsVisible(true)}>
            <Icon name="folder-minus" style={styles.optionIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={playlistFlatListRef}
        style={styles.list}
        data={listPls}
        renderItem={({ item }) => <PlaylistItem playlist={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    backgroundColor: mainTheme.SECONDARY_COLOR,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    // marginVertical: 5,
    borderColor: mainTheme.FONT_COLOR2,
  },
  list: {
    overflow: "scroll",
    // backgroundColor: "salmon",
  },
  item: {
    color: mainTheme.FONT_COLOR,
  },
  titleSection: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 10,
    color: mainTheme.FONT_COLOR,
    borderBottomColor: mainTheme.FONT_COLOR2,
    alignItems: "center",
  },
  titleNum: {
    flex: .2,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    borderBottomWidth: 1,
    // borderWidth: 1,
    // borderRadius: 10,
    borderColor: mainTheme.FONT_COLOR2,
    fontSize: 20,
    color: mainTheme.FONT_COLOR,
    fontWeight: "200"
  },
  titleText: {
    flex: .5,
    color: mainTheme.FONT_COLOR,
    fontWeight: "200",
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red"
  },
  titleSectionOptions: {
    flex: .3,
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderWidth: 1,
    paddingVertical: 2,
    borderRadius: 10,
    borderColor: mainTheme.FONT_COLOR2
  },
  optionIcon: {
    color: mainTheme.FONT_COLOR,
    fontSize: 30,
  },
});
