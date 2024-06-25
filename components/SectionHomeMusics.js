import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ToastAndroid,
  VirtualizedList,
} from "react-native";
import { mainTheme } from "./Palete";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { MusicItem } from "./MusicItem";
import Icon from "react-native-vector-icons/FontAwesome6";
import {
  ListLocalMusicsContext,
  ListMusicsContext,
} from "../providers/ProviderLists";
import { PlsSelectedContext } from "../providers/ProviderSelections";
import {
  ModalAddMusicContext,
  ModalAddMusicToPlsContext,
  ModalRemoveMusicToPlsContext,
} from "../providers/ProviderModals";
import { WsConnectContext } from "../providers/ProviderConnection";
import { ListChangesContext } from "../providers/ProviderChanges";
import { ChangesInProcessContext } from "../providers/ProviderProcesses";

const MemoMusicItem = memo(MusicItem)

export function SectionHomeMusics() {
  //WS CONNECTED
  const wsConnected = useContext(WsConnectContext);

  //LIST CHANGES
  const {listChanges} = useContext(ListChangesContext);
  const {changesInProcess, setChangesInProcess} = useContext(ChangesInProcessContext);

  //LIST LOCAL
  const { listLocalMusics } = useContext(ListLocalMusicsContext);

  //LIST REMOTE
  const { listMusics } = useContext(ListMusicsContext);
  const { plsSelected } = useContext(PlsSelectedContext);
  const { setModalAddMusicIsVisible } = useContext(ModalAddMusicContext);
  const { setModalRemoveMusicToPlsIsVisible } = useContext(
    ModalRemoveMusicToPlsContext
  );
  const { setModalAddMusicToPlsIsVisible } = useContext(
    ModalAddMusicToPlsContext
  );

  const musicFlatListRef = useRef(null);

  const scrollToInit = () => {
    musicFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const getItemLayout = (data, index) => (
    {length: 80, offset: 80 * index, index: index}
  )

  const getItemCount = (data) => data.length;

  const getItem = (data, index) => data[index];

  useEffect(() => {
    if (listMusics.length > 1 || listLocalMusics.length > 1) {
      scrollToInit();
    }
  }, [listMusics, listLocalMusics]);

  function addMusic() {
    // ToastAndroid.show("Add music", ToastAndroid.SHORT);
    if (plsSelected === 0) {
      setModalAddMusicIsVisible(true);
    } else {
      setModalAddMusicToPlsIsVisible(true);
    }
  }

  function removeMusic() {
    // ToastAndroid.show("Remove music", ToastAndroid.SHORT);
    setModalRemoveMusicToPlsIsVisible(true);
  }

  //STYLES
  const styles = StyleSheet.create({
    container: {
      pointerEvents: changesInProcess ? "none" : "auto",
      opacity: changesInProcess ? 0.5 : 1,
      flex: changesInProcess || listChanges.length > 0 ? 5.3 : 5,
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
      justifyContent: "center",
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
          {wsConnected ? listMusics.length : listLocalMusics.length}
        </Text>
        <Text style={styles.titleText}> Canciones </Text>
        <View style={styles.titleSectionOptions}>
          <TouchableOpacity onPress={addMusic}>
            <Icon name="file-circle-plus" style={styles.optionIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={removeMusic}>
            <Icon name="file-circle-minus" style={styles.optionIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <VirtualizedList
        ref={musicFlatListRef}
        style={styles.list}
        scroll
        data={wsConnected ? listMusics : listLocalMusics}
        renderItem={({ item }) => <MemoMusicItem music={item} />}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        getItemLayout={getItemLayout}
        getItem={getItem}
        getItemCount={getItemCount}
      />
    </View>
  );
}
