import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { mainTheme } from "./Palete";
import { useContext, useEffect, useRef } from "react";
import { MusicItem } from "./MusicItem";
import Icon from "react-native-vector-icons/FontAwesome6";
import { ListMusicsContext } from "../providers/ProviderLists";
import { PlsSelectedContext } from "../providers/ProviderSelections";
import { ModalAddMusicContext, ModalAddMusicToPlsContext, ModalRemoveMusicToPlsContext } from "../providers/ProviderModals";

export function SectionHomeMusics() {
  const { listMusics } = useContext(ListMusicsContext);
  const { plsSelected } = useContext(PlsSelectedContext);
  const { setModalAddMusicIsVisible } = useContext(ModalAddMusicContext);
  const {setModalRemoveMusicToPlsIsVisible} = useContext(ModalRemoveMusicToPlsContext);
  const { setModalAddMusicToPlsIsVisible } = useContext(ModalAddMusicToPlsContext);

  const musicFlatListRef = useRef(null);

  const scrollToInit = () => {
    musicFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  useEffect(() => {
    if (listMusics.length > 1) {
      scrollToInit();
    }
  }, [listMusics]);

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

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.titleNum}>{listMusics.length}</Text>
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
      <FlatList
        ref={musicFlatListRef}
        style={styles.list}
        scroll
        data={listMusics}
        renderItem={({ item }) => <MusicItem music={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
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
    // marginVertical: 10
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
    justifyContent: "center",
  },
  titleNum: {
    flex: 0.2,
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
    fontWeight: "200",
  },
  titleText: {
    flex: 0.5,
    color: mainTheme.FONT_COLOR,
    fontWeight: "200",
    fontSize: 20,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    // alignSelf: "center",
    // backgroundColor: "red"
  },
  titleSectionOptions: {
    flex: 0.3,
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderWidth: 1,
    paddingVertical: 2,
    borderRadius: 10,
    borderColor: mainTheme.FONT_COLOR2,
  },
  optionIcon: {
    color: mainTheme.FONT_COLOR,
    fontSize: 30,
  },
});
