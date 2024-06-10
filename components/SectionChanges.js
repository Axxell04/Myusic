import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { mainTheme } from "./Palete";
import { RequestModel } from "../models/RequestModel";
import { useContext } from "react";
import { RequestStateContext } from "../providers/ProviderModels";
import { ConfirmChangesContext } from "../providers/ProviderChanges";

export function SectionChanges() {
  const { requestState, setRequestState } = useContext(RequestStateContext);
  const { confirmChanges, setConfirmChanges } = useContext(
    ConfirmChangesContext
  );

  const get = () => {
    setRequestState(new RequestModel("getSyncPls"));
  };

  const makeChanges = () => {
    console.log("Make Changes")
    setConfirmChanges(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Section Changes</Text>
      <TouchableOpacity style={styles.button} onPress={get}>
        <Text style={styles.buttonText}>Show Pls</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={makeChanges}>
        <Text style={styles.buttonText}>Confirm Changes</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    borderColor: mainTheme.FONT_COLOR2,
    backgroundColor: mainTheme.SECONDARY_COLOR,
    // opacity: wsIsConnected ? 1 : .7,
    // alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 10
    // borderColor: mainTheme.FONT_COLOR
  },
  title: {
    color: mainTheme.FONT_COLOR,
  },
  button: {
    padding: 4,
    borderColor: mainTheme.FONT_COLOR,
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonText: {
    color: mainTheme.FONT_COLOR2,
  },
});
