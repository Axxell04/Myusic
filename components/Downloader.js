import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
import { Button, ToastAndroid, View } from "react-native";

export function Downloader() {
  const [serverUrlFile, setServerUrlFile] = useState(
    "http://192.168.1.9:8000/download/62"
  );
  const [localUrlFile, setLocalUrlFile] = useState(
    FileSystem.documentDirectory + "musics/music.mp3"
  );
  const [music, setMusic] = useState();

  useEffect(() => {
    return music
      ? () => {
          console.log('Unloading Music');
          music.unloadAsync();
        }
      : undefined;
  }, [music]);

  async function download() {
    ToastAndroid.show("Descargando...", ToastAndroid.SHORT);
    const infoDir = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "musics/"
    );

    if (!infoDir.exists) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "musics/"
      );
    }
    const response = await FileSystem.downloadAsync(
      serverUrlFile,
      localUrlFile
    );
    console.log(response.headers);
    console.log(response.md5);
    console.log(response.mimeType);
    console.log(response.status);
    console.log(response.uri);
  }

  async function remove() {
    ToastAndroid.show("Eliminando...", ToastAndroid.SHORT);
    const response = await FileSystem.deleteAsync(localUrlFile);
    console.log("Eliminado");
  }

  async function show() {
    const response = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "musics/"
    );
    console.log(response);
  }

  async function play() {
    if (music) {
        await music.pauseAsync();
    }
    console.log("Loading music...");
    const { sound } = await Audio.Sound.createAsync(
        // { uri: localUrlFile },
      { uri: serverUrlFile },
      { shouldPlay: true }
    );
    setMusic(sound);

    console.log("Playing music...");
    await sound.playAsync();
    // await sound.pauseAsync();
  }

  async function pause() {
    if (music) {
      await music.pauseAsync();
    }
  }

  return (
    <View style={{ flexDirection: "row" }}>
      <Button title="Download" onPress={download} />
      <Button title="Delete" onPress={remove} />
      <Button title="Show" onPress={show} />
      <Button title="Play" onPress={play} />
      <Button title="Pause" onPress={pause} />
    </View>
  );
}
