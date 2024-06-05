import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  ToastAndroid,
} from "react-native";
// import * as FileSystem from "expo-file-system";

import { Providers } from "./components/Context";
import { SectionHomeMusics } from "./components/SectionHomeMusics";
import { SectionHomePlaylist } from "./components/SectionHomePlaylist";
import { BottomBar } from "./components/BottomBar";
import { mainTheme } from "./components/Palete";
import WS from "./WS";
import { ModalAddMusic } from "./modals/ModalAddMusic";
import {
  ModalCreatePlaylist,
  ModalNotification,
} from "./modals/ModalCreatePlaylist";
import { ModalRemovePlaylist } from "./modals/ModalRemovePlaylist";
import { ModalAddMusicToPls } from "./modals/ModalAddMusicToPls";
import { ModalRemoveMusicToPls } from "./modals/ModalRemoveMusicToPls";
import { ModalConnect } from "./modals/ModalConnect";
import { MusicPlayer } from "./class/MusicPlayer";
import { SectionPlayer } from "./components/SectionPlayer";
import { SectionConnection } from "./components/SectionConnection";

export default function App() {
  
  return (
    <Providers>
      <SafeAreaView style={styles.containerMain}>
        <StatusBar hidden={false} backgroundColor={mainTheme.PRIMARY_COLOR} />
        <View style={styles.containerInner}>
          <SectionConnection />
          <SectionHomePlaylist />
          <SectionHomeMusics />
          <SectionPlayer />
        </View>
        <MusicPlayer />
        <ModalConnect />
        <ModalAddMusic />
        <ModalAddMusicToPls />
        <ModalRemoveMusicToPls />
        <ModalRemovePlaylist />
        <ModalCreatePlaylist />
        <BottomBar />
      </SafeAreaView>
    </Providers>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: mainTheme.PRIMARY_COLOR,
    overflow: "hidden",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: "absolute",

    // overflow: "hidden",
  },
  containerInner: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    overflow: "scroll",
    gap: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  list: {
    // maxHeightheight: 10,
    overflow: "scroll",
    backgroundColor: "green",
  },
});
