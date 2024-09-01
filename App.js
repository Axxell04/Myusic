import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { Providers } from "./components/Context";
import { BottomBar } from "./components/BottomBar";
import { mainTheme } from "./components/Palete";
import { ModalAddMusic } from "./modals/ModalAddMusic";
import {
  ModalCreatePlaylist,
} from "./modals/ModalCreatePlaylist";
import { ModalRemovePlaylist } from "./modals/ModalRemovePlaylist";
import { ModalAddMusicToPls } from "./modals/ModalAddMusicToPls";
import { ModalRemoveMusicToPls } from "./modals/ModalRemoveMusicToPls";
import { ModalConnect } from "./modals/ModalConnect";
import { MusicPlayer } from "./class/MusicPlayer";
import { ManagerLists } from "./class/ManagerLists";
import { ModalYT } from "./modals/ModalYT";
import { ScreenMain } from "./screens/ScreenMain";


export default function App() {
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
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });
  return (
    <Providers>
      <SafeAreaView style={styles.containerMain}>
        <StatusBar hidden={false} backgroundColor={mainTheme.PRIMARY_COLOR} />
        <ScreenMain />
        <ManagerLists />
        <MusicPlayer />
        <ModalConnect />
        <ModalAddMusic />
        <ModalYT />
        <ModalAddMusicToPls />
        <ModalRemoveMusicToPls />
        <ModalRemovePlaylist />
        <ModalCreatePlaylist />
        <BottomBar />
      </SafeAreaView>
    </Providers>
  );
}

