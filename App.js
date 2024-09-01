import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

import { BottomBar } from "./lib/sections/BottomBar";
import { mainTheme } from "./lib/components/Palete";
import { ModalAddMusic } from "./lib/modals/ModalAddMusic";
import {
  ModalCreatePlaylist,
} from "./lib/modals/ModalCreatePlaylist";
import { ModalRemovePlaylist } from "./lib/modals/ModalRemovePlaylist";
import { ModalAddMusicToPls } from "./lib/modals/ModalAddMusicToPls";
import { ModalRemoveMusicToPls } from "./lib/modals/ModalRemoveMusicToPls";
import { ModalConnect } from "./lib/modals/ModalConnect";
import { MusicPlayer } from "./lib/class/MusicPlayer";
import { ManagerLists } from "./lib/class/ManagerLists";
import { ModalYT } from "./lib/modals/ModalYT";
import { ScreenMain } from "./lib/screens/ScreenMain";
import { Providers } from "./lib/providers/Context";


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

