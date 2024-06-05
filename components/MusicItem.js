import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { mainTheme } from "./Palete";
import Icon from "react-native-vector-icons/AntDesign";
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../providers/ProviderProcesses";
import { IpServerContext } from "../providers/ProviderConnection";
import TrackPlayer from "react-native-track-player";
import { ListMusicsContext, ListTrackContext, TrackSelectedContext } from "../providers/ProviderLists";
import { IdListTrackContext, PlsSelectedContext } from "../providers/ProviderSelections";

export function MusicItem({ music }) {
  const {plsSelected} = useContext(PlsSelectedContext);
  const {listMusics} = useContext(ListMusicsContext);
  const {setListTrack} = useContext(ListTrackContext);
  const {setIdListTrack} = useContext(IdListTrackContext);
  const {setTrackSelected} = useContext(TrackSelectedContext);
  const {ipServer} = useContext(IpServerContext);
  const player = useContext(PlayerContext);
  const formatDuration = (duration) => {
    var arrayDuration = duration.split(":");
    var h = arrayDuration[0];
    var m = arrayDuration[1];
    var s = arrayDuration[2];

    if (h === "00") {
        return `${m}:${s}`
    } else {
        return duration
    }

  };

  const getIndexOfMusic = async () => {
    const index = (await TrackPlayer.getQueue()).findIndex((track) => {
      if (track.artist === music.author && track.title === music.name) {
        return true;
      }
    })
    // console.log("Index: "+ index);
    return index
  }

  const changeListTrack = () => {
    setListTrack(listMusics);
  }

  const playMusic = () => {
    console.log(music)
    setTrackSelected(music);
    changeListTrack();
    setIdListTrack(plsSelected);
  }

  const [indexMusic, setIndexMusic] = useState(getIndexOfMusic())
 
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.section1} onPress={ () => playMusic()}>
        <Text key={music.path} style={styles.title}>
          {music.name}
        </Text>
        <View style={styles.section1_1}>
          <Text style={styles.author}>{music.author}</Text>
          <Text style={styles.duration}>{formatDuration(music.duration)}</Text>
        </View> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.section2}>
      <Icon name="checkcircle" size={30} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    gap: 10,
    justifyContent: "center",
    alignItems: "center"
    // paddingVertical: 10,
    // paddingHorizontal: 5,
  },
  section1: {
    flex: 1,
    borderWidth: .7,
    borderColor: mainTheme.FONT_COLOR2,
    padding: 10,
    gap: 5,
    borderRadius: 10
  },
  section1_1: {
    flexDirection: "row",
    overflow: "scroll",
    // justifyContent: "center",
    alignItems: "center"
  },
  section2: {
    // flex: .3,
    // borderWidth: 0.7,
    // borderColor: mainTheme.FONT_COLOR2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10
  },
  title: {
    color: mainTheme.FONT_COLOR,
    fontSize: 15,
    fontWeight: "300",
    // textAlign: "center"
  },
  author: {
    flex: .8,
    paddingRight: 5,
    color: mainTheme.FONT_COLOR2,
    fontWeight: "300"
    // textAlign: "center"
  },
  duration: {
    flex: .2,
    borderBottomWidth: .5,
    paddingHorizontal: 5,
    textAlign: "center",
    color: mainTheme.FONT_COLOR2,
    borderBottomColor: mainTheme.FONT_COLOR,
    fontWeight: "300"
    
  },
  icon: {
    color: mainTheme.FONT_COLOR,
    textAlign: "center"
  }
});
