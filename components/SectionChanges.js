import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Progress from "react-native-progress";
import { mainTheme } from "./Palete";
import { RequestModel } from "../models/RequestModel";
import { useContext, useEffect, useState } from "react";
import {
  CounterChangesTotalContext,
  CounterDoneChangesContext,
  ManagerChangesContext,
} from "../providers/ProviderChanges";
import { ChangesInProcessContext } from "../providers/ProviderProcesses";

export function SectionChanges() {
  const {changesInProcess, setChangesInProcess} = useContext(ChangesInProcessContext);

  const [widthProgressBar, setWidthProgessBar] = useState(0);

  //MANAGER CHANGES
  const managerChanges = useContext(ManagerChangesContext);

  //Contadores de cambios
  const {counterChangesTotal} = useContext(CounterChangesTotalContext);
  const {counterDoneChanges} = useContext(CounterDoneChangesContext);

  const clearChanges = () => {
    managerChanges.removeAllChanges();
  };

  const makeChanges = () => {
    managerChanges.makeChanges();
  };

  const onLayout = (event) => {
    const {width} = event.nativeEvent.layout;
    setWidthProgessBar(width);
  }

  //STYLES
  const styles = StyleSheet.create({
    container: {
      height: 80,
      flex: .7,
      display: changesInProcess || counterChangesTotal > 0 ? "flex" : "none",
      flexDirection: "row",
      borderColor: mainTheme.FONT_COLOR2,
      backgroundColor: mainTheme.SECONDARY_COLOR,
      gap: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderWidth: 1,
      borderRadius: 10,
    },
    sectionText: {
      display: changesInProcess ? "none" : "flex",
      flexDirection: "column",
      flexGrow: 1,
      gap: 1,
    },
    counter: {
      color: mainTheme.FONT_COLOR,
      fontWeight: "300",
      textAlign: "center",
    },
    title: {
      color: mainTheme.FONT_COLOR,
      textAlign: "center",
    },
    sectionButtons: {
      display: changesInProcess ? "none" : "flex",
      flexDirection: "row",
      gap: 3,
    },
    button: {
      padding: 4,
      borderWidth: 1,
      borderRadius: 10,
      justifyContent: "center",
    },
    buttonPrimary: {
      backgroundColor: mainTheme.FONT_COLOR,
      borderColor: mainTheme.FONT_COLOR,
    },
    buttonPrimaryText: {
      color: mainTheme.SECONDARY_COLOR,
    },
    buttonSecondary: {
      backgroundColor: mainTheme.SECONDARY_COLOR,
      borderColor: mainTheme.FONT_COLOR,
    },
    buttonSecondaryText: {
      color: mainTheme.FONT_COLOR,
    },
    sectionP: {
      display: changesInProcess ? "flex" : "none",
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    textP: {
      color: mainTheme.FONT_COLOR2,
      fontWeight: "300"
    },
    counterP: {
      color: mainTheme.FONT_COLOR,
      marginBottom: 3
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.sectionText}>
        <Text style={styles.counter}>{counterChangesTotal}</Text>
        <Text style={styles.title}>
          {counterChangesTotal === 1 ? "Cambio Pendiente" : "Cambios Pendientes"}
        </Text>
      </View>
      <View style={styles.sectionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={clearChanges}
        >
          <Text style={styles.buttonSecondaryText}>Descartar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={makeChanges}
        >
          <Text style={styles.buttonPrimaryText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionP} onLayout={onLayout}>
        <Text style={styles.textP}>Cambios Realizados</Text>
        <Text style={styles.counterP}>{counterDoneChanges} / {counterChangesTotal}</Text>
        <Progress.Bar progress={counterChangesTotal > 0 && counterChangesTotal > counterDoneChanges ? counterDoneChanges / counterChangesTotal : 0} width={widthProgressBar} color={mainTheme.FONT_COLOR}/>
      </View>
    </View>
  );
}
