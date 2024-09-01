import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  ProgressBarAndroidComponent,
} from "react-native";
import { mainTheme } from "../components/Palete";
import * as Progress from "react-native-progress";
import { useContext, useEffect, useRef } from "react";
import { DownloadInProcessContext } from "../providers/ProviderProcesses";
import { WsConnectContext } from "../providers/ProviderConnection";

export function SectionProcess() {

    const {downloadInProcess} = useContext(DownloadInProcessContext);
    const wsConnected = useContext(WsConnectContext);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: mainTheme.SECONDARY_COLOR,
      borderWidth: 1,
      borderColor: mainTheme.FONT_COLOR2,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 7,
      gap: 4,
      display: downloadInProcess && wsConnected ? "flex" : "none",
    },
    status: {
      color: mainTheme.FONT_COLOR,
      fontWeight: "300",
    },
    animatedBorder: {
      width: 15,
      height: 15,
      borderRadius: 999999,
      borderWidth: 1,
        borderStyle: "dashed",
      borderColor: "lime", // Color del borde que se animará
    },
  });
  return (
    <TouchableOpacity style={styles.container} onPress={() => {}}>
        <Text style={styles.status}>Descargando</Text>
        <Animated.View
        style={[
          styles.animatedBorder,
          {
            transform: [{ rotate }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}
