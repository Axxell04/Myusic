import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  VirtualizedList,
} from "react-native";
import { mainTheme } from "../components/Palete";
import { useContext, useEffect, useRef } from "react";
import { PlaylistItem } from "../components/PlaylistItem";
import Icon from "react-native-vector-icons/FontAwesome6";
import {
  ListLocalPlsContext,
  ListPlsContext,
} from "../providers/ProviderLists";
import { PlsSelectedContext } from "../providers/ProviderSelections";
import {
  ModalCreatePlsContext,
  ModalRemovePlsContext,
} from "../providers/ProviderModals";
import { WsConnectContext } from "../providers/ProviderConnection";
import { CounterChangesTotalContext } from "../providers/ProviderChanges";
import { ChangesInProcessContext } from "../providers/ProviderProcesses";

export function SectionHomePlaylist() {
  //WS CONNECTED
  const wsConnected = useContext(WsConnectContext);

  //CHANGES IN PROCESS
  const {changesInProcess} = useContext(ChangesInProcessContext);

  //COUNTER CHANGES
  const {counterChangesTotal} = useContext(CounterChangesTotalContext);

  //LIST LOCAL
  const { listLocalPls } = useContext(ListLocalPlsContext);

  //LIST REMOTE
  const { listPls } = useContext(ListPlsContext);
  const { plsSelected, setPlsSelected } = useContext(PlsSelectedContext);
  const { setModalCreatePlsIsVisible } = useContext(ModalCreatePlsContext);
  const { setModalRemovePlsIsVisible } = useContext(ModalRemovePlsContext);

  const playlistFlatListRef = useRef(null);

  const getItemLayout = (data, index) => (
    { length: 70, offset: 70 * index, index }
  );

  const getItemCount = (data) => data.length;

  const getItem = (data, index) => data[index];

  const scrollToInit = () => {
    playlistFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const scrollToIndex = (index = 0) => {
    playlistFlatListRef.current.scrollToIndex({ index: index, animated: true });
  };

  useEffect(() => {
    if (listPls.length > 1 || listLocalPls.length > 1) {
      setPlsSelected(0);
      scrollToInit();
    }
  }, [listPls, listLocalPls]);

  useEffect(() => {
    if (wsConnected && counterChangesTotal > 0) {
      const index = listPls.findIndex((plsItem) => {
        return plsItem.id === plsSelected;
      });
      if (index != -1) {
        scrollToIndex(index);
      }
    }
  }, [counterChangesTotal]);

  //STYLES
  const styles = StyleSheet.create({
    container: {
      pointerEvents: changesInProcess || counterChangesTotal > 0 ? "none" : "auto",
      opacity: changesInProcess || counterChangesTotal > 0 ? 0.5 : 1,
      flex: 2,
      backgroundColor: mainTheme.SECONDARY_COLOR,
      padding: 10,
      width: "100%",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: mainTheme.FONT_COLOR2,
    },
    list: {
      overflow: "scroll",
    },
    item: {
      color: mainTheme.FONT_COLOR,
    },
    titleSection: {
      position: "relative",
      flexDirection: "row",
      borderBottomWidth: 1,
      paddingBottom: 10,
      color: mainTheme.FONT_COLOR,
      borderBottomColor: mainTheme.FONT_COLOR2,
      alignItems: "center",
    },
    titleNum: {
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderBottomWidth: 1,
      borderColor: mainTheme.FONT_COLOR2,
      fontSize: 20,
      color: mainTheme.FONT_COLOR,
      fontWeight: "200",
      position: "absolute",
      top: 0,
      left: 0,
      width: "auto",
      paddingHorizontal: 10,
    },
    titleText: {
      flex: 1,
      color: mainTheme.FONT_COLOR,
      fontWeight: "200",
      fontSize: 20,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    },
    titleSectionOptions: {
      display: wsConnected ? "flex" : "none",
      flex: 0.3,
      gap: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 2,
      borderRadius: 10,
      borderColor: mainTheme.FONT_COLOR2,
      position: "absolute",
      top: 0,
      right: 0,
      width: "auto",
      paddingHorizontal: 10,
    },
    optionIcon: {
      color: mainTheme.FONT_COLOR,
      fontSize: 30,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.titleNum}>
          {wsConnected ? listPls.length : listLocalPls.length}
        </Text>
        <Text style={styles.titleText}> Playlists </Text>
        <View style={styles.titleSectionOptions}>
          <TouchableOpacity onPress={() => setModalCreatePlsIsVisible(true)}>
            <Icon name="folder-plus" style={styles.optionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalRemovePlsIsVisible(true)}>
            <Icon name="folder-minus" style={styles.optionIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <VirtualizedList
        ref={playlistFlatListRef}
        style={styles.list}
        data={wsConnected ? listPls : listLocalPls}
        renderItem={({ item }) => <PlaylistItem playlist={item} />}
        keyExtractor={(item) => item.id}
        getItemLayout={getItemLayout}
        getItemCount={getItemCount}
        getItem={getItem}
      />
    </View>
  );
}
