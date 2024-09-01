import { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/FontAwesome6";
import { mainTheme } from "../components/Palete";
import {
  ChangesInProcessContext,
  MusicDurationContext,
  MusicPositionContext,
  PlayerContext,
  PlayingMusicContext,
} from "../providers/ProviderProcesses";
import * as Progress from "react-native-progress";
import TrackPlayer, { State, useProgress } from "react-native-track-player";
import {
  ActiveMusicAuthorContext,
  ActiveMusicTitleContext,
} from "../providers/ProviderSelections";
import { CounterChangesTotalContext } from "../providers/ProviderChanges";

export function SectionPlayer() {
  const { playingMusic, setPlayingMusic } = useContext(PlayingMusicContext);
  const { activeMusicTitle } = useContext(ActiveMusicTitleContext);
  const { activeMusicAuthor } = useContext(ActiveMusicAuthorContext);

  const {changesInProcess, setChangesInProcess} = useContext(ChangesInProcessContext);

  //COUNTER CHANGES
  const {counterChangesTotal} = useContext(CounterChangesTotalContext);

  const [widthProgressBar, setWidthProgressBar] = useState(0);
  // const [musicTitle, setMusicTitle] = useState("");
  // const [musicAuthor, setMusicAuthor] = useState("");

  const getMusicTitle = async () => {
    const track = await TrackPlayer.getActiveTrack();
    return track.title;
  };

  const getMusicAuthor = async () => {
    const track = await TrackPlayer.getActiveTrack();
    return track.artist;
  };

  const progress = useProgress();

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWidthProgressBar(width);
    // console.log(width);
  };

  const playMusic = async () => {
    const pbState = await TrackPlayer.getPlaybackState();
    // console.log(pbState)
    if (pbState.state === State.Paused || pbState.state === State.Ready) {
      await TrackPlayer.play();
    }
  };
  const pauseMusic = async () => {
    const pbState = await TrackPlayer.getPlaybackState();
    if (pbState.state === State.Playing) {
      await TrackPlayer.pause();
    }
  };
  const skipPrevious = async () => {
    await TrackPlayer.skipToPrevious();
  };
  const skipNext = async () => {
    await TrackPlayer.skipToNext();
  };

  //STYLES
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      display: changesInProcess || counterChangesTotal > 0 ? "none" : "flex",
      borderColor: mainTheme.FONT_COLOR2,
      backgroundColor: mainTheme.SECONDARY_COLOR,
      // opacity: wsIsConnected ? 1 : .7,
      // alignItems: "center",
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 1,
      borderRadius: 10,
      // borderColor: mainTheme.FONT_COLOR
    },
    musicInfoContainer: {
      //flex: 1,
      height: 45,
      // flexDirection: "row"
      borderBottomWidth: 1,
      borderColor: mainTheme.FONT_COLOR2,
      paddingBottom: 1,
      alignSelf: "flex-start",
      paddingHorizontal: 3,
    },
    musicInfoTitle: {
      color: mainTheme.FONT_COLOR,
      fontSize: 15,
      fontWeight: "300",
    },
    musicInfoAuthor: {
      color: mainTheme.FONT_COLOR2,
      fontWeight: "300",
    },
    musicControlersContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
    playerIcon: {
      // flex: 1,
      textAlign: "center",
      color: mainTheme.FONT_COLOR,
      fontSize: 30,
    },
    containerProgressBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    progressBar: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.musicInfoContainer}>
        <Text style={styles.musicInfoTitle}>{activeMusicTitle}</Text>
        <Text style={styles.musicInfoAuthor}>{activeMusicAuthor}</Text>
      </View>
      <View style={styles.musicControlersContainer}>
        <View style={styles.containerProgressBar} onLayout={onLayout}>
          <Progress.Bar
            style={styles.progressBar}
            progress={
              progress.duration > 0 && progress.duration > progress.position
                ? Math.min(progress.position / progress.duration, 1)
                : 0
            }
            color={mainTheme.FONT_COLOR}
            borderColor={mainTheme.FONT_COLOR2}
            width={widthProgressBar}
          />
        </View>
        <TouchableOpacity onPress={skipPrevious}>
          <Icon2
            name="forward-step"
            style={[styles.playerIcon, { transform: [{ rotateY: "180deg" }] }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={playingMusic ? pauseMusic : playMusic}
          style={{ width: 23, justifyContent: "center", alignItems: "center" }}
        >
          <Icon2
            name={playingMusic ? "pause" : "play"}
            style={styles.playerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipNext}>
          <Icon2 name="forward-step" style={styles.playerIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
