import React, { useState, useEffect } from "react";
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
} from "react-native";
import * as FileSystem from "expo-file-system";

const Item = ({ title }) => (
  <View>
    <Text key={title} style={styles.item}>
      {decodeURIComponent(title).split(":").pop()}
    </Text>
  </View>
);

export default function App() {
  const [directories, setDirectories] = useState([]);
  const [mainDirectory, setMainDirectory] = useState("");
  const [newDirName, setNewDirName] = useState("");

  useEffect(() => {
    listFiles();
  }, [directories, mainDirectory])

  const listFiles = async () => {
    if (mainDirectory) {
      const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(mainDirectory);
      setDirectories(files);

    }
  }

  const requestPermission = async () => {
    const { granted, directoryUri } =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    // "file:///data/user/0/host.exp.exponent/files/"
    // "file:///data/user/0/host.exp.exponent/"
    if (!granted) {
      alert("Se necesita permiso para acceder al directorio");
    } else {
      alert(`Acceso concedido: ${directoryUri}`);
      setMainDirectory(directoryUri);
      listFiles();
      // const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(
      //   directoryUri
      // );
      // setDirectories(files);
    }
  };

  const makeDirectory = async () => {
    if (newDirName) {
      Alert.alert("Confirmación", "¿Desea crea la nueva carpeta?", [
        {
          text: "Sí",
          onPress: async () => {
            await FileSystem.StorageAccessFramework.makeDirectoryAsync(
              mainDirectory,
              newDirName
            );
            setNewDirName("")
          },
        },
        { text: "No", onPress: () => console.log("Creacion cancelada") },
      ]);
      // validation ? alert("Carpeta creada") : alert("Acción canceladad")
    } else {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text key={34234234}>Main Directory: {decodeURIComponent(mainDirectory)}</Text>
      <Button title="Listar directorioSs" onPress={requestPermission} />
      <Text key={88888}>Directories: </Text>
      <View
        style={{
          backgroundColor: "blue",
          maxHeight: 200,
          marginHorizontal: 10,
          marginVertical: 10,
          padding: 20,
        }}
      >
        <FlatList
          style={styles.list}
          data={directories}
          renderItem={({ item }) => <Item title={item} />}
        />
      </View>
      <View style={{ backgroundColor: "red", padding: 30 }}>
        <Button title="Nueva carpeta" onPress={makeDirectory} />
        <TextInput
          style={styles.input}
          onChangeText={setNewDirName}
          value={newDirName}
        ></TextInput>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 0,
    overflow: "scroll",
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
  item: {
    marginVertical: 5,
    backgroundColor: "salmon",
  },
});
