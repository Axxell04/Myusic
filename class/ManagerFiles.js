import * as FileSystem from "expo-file-system";
import { useContext, useEffect, useState } from "react";
import {
  FileToAddContext,
  FileToRemoveContext,
  InitProcessAddContext,
  InitProcessRemoveContext,
  ListFilesToAddContext,
  ListFilesToRemoveContext,
} from "../providers/ProviderFiles";
import { IpServerContext } from "../providers/ProviderConnection";
import { CounterChangesOfDesyncContext, CounterChangesOfSyncContext, DoneChangesContext } from "../providers/ProviderChanges";
import { RequestStateContext } from "../providers/ProviderModels";

export function ManagerFiles() {
  const { ipServer } = useContext(IpServerContext);
  const { fileToAdd, setFileToAdd } = useContext(FileToAddContext);
  const { fileToRemove, setFileToRemove } = useContext(FileToRemoveContext);

  const {listFilesToAdd, setListFilesToAdd} = useContext(ListFilesToAddContext);
  const {listFilesToRemove, setListFilesToRemove} = useContext(ListFilesToRemoveContext);

  const { doneChanges, setDoneChanges } = useContext(DoneChangesContext);

  const {initProcessAdd, setInitProcessAdd} = useContext(InitProcessAddContext);
  const {initProcessRemove, setInitProcessRemove} = useContext(InitProcessRemoveContext);

  const {counterChangesOfSync, setCounterChangesOfSync} = useContext(CounterChangesOfSyncContext);
  const {counterChangesOfDesync, setCounterChangesOfDesync} = useContext(CounterChangesOfDesyncContext);

  const [maxLengthListToAdd, setMaxLengthListToAdd] = useState(0);
  const [maxLengthListToRemove, setMaxLengthListToRemove] = useState(0);

  const initManager = async () => {
    const infoDir = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "musics/"
    );
    if (!infoDir.exists) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "musics/"
      );
    }
  };

  useEffect(() => {
    initManager();
  }, []);

  const check = async (localURI) => {
    const infoFile = await FileSystem.getInfoAsync(localURI);

    if (infoFile.exists) {
      return true;
    } else {
      return false;
    }
  };

  const download = async (remoteURI, localURI) => {
    console.log("Archivo a descargar: "+localURI);
    const infoMusicsDir = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "musics/"
    );
    if (!infoMusicsDir.exists) {
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "musics/"
      );
    }
    const dirName = localURI.split("/").reverse()[1];
    const infoDir = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "musics/" + dirName
    );

    if (!infoDir.exists) {
      //##AL GUARDA UNA PLS CON EL NOMBRE :) GENERA UN ERROR AL CREAR LA CARPETA, SOLUCIONAR EL ERROR
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "musics/" + dirName
      );
    }

    if ((await check(localURI)) === false) {
      const response = await FileSystem.downloadAsync(remoteURI, localURI);
      console.log("Descargado");
    }
    console.log("Done changes: " + doneChanges);
    setDoneChanges(doneChanges + 1);
    setFileToAdd(null);
    setListFilesToAdd(listFilesToAdd.filter((fta) => {
      return fta.localURI != localURI;
    }))
  };

  const remove = async (localURI) => {
    const infoDir = await FileSystem.getInfoAsync(localURI);
    if (infoDir.exists) {
      await FileSystem.deleteAsync(localURI);
      console.log("Eliminando: " + localURI);
    }
    console.log("Done changes: " + doneChanges);
    setDoneChanges(doneChanges + 1);
    setFileToRemove(null);
    setListFilesToRemove(listFilesToRemove.filter((ftr) => {
      return ftr.localURI != localURI;
    }));
  };

  //Detectando si estamos listos para activar el manejo de archivos a añadir
  useEffect(() => {
    if (counterChangesOfSync>0 && counterChangesOfSync === listFilesToAdd.length) {
      setInitProcessAdd(true);
    }
  }, [listFilesToAdd])

  //Detectando si estamos listos para activar el manejo de archivos a remover
  useEffect(() => {
    if (counterChangesOfDesync>0 && counterChangesOfDesync === listFilesToRemove.length) {
      setInitProcessRemove(true);
    }
  }, [listFilesToRemove])

  //Manejando la lista de archivos por añadir
  useEffect(() => {
    //##AL PARECER CUANDO LISTFILESTOADD.LENGTH CAMBIA A 1 ESTA YA DETECTA QUE INITPROCESSADD YA ES TRUE
    console.log("ListFilesToAddLength: "+listFilesToAdd.length);
    console.log("CounterChangesOfSync: "+counterChangesOfSync);
    console.log("MaxLength: "+maxLengthListToAdd);
    console.log("FileToAdd: "+fileToAdd);
    if (listFilesToAdd.length > 0) {
      let newLength = listFilesToAdd.length;
      if (newLength > maxLengthListToAdd) {setMaxLengthListToAdd(newLength)}
      if (!fileToAdd && (newLength === counterChangesOfSync || maxLengthListToAdd === counterChangesOfSync)) {
        let fta = listFilesToAdd[0];
        setFileToAdd(fta)
      }
    } else if (listFilesToAdd.length === 0) {
      // setMaxLengthListToAdd(0);
      // setCounterChangesOfSync(0);
    }
  }, [listFilesToAdd])

  //Manejando la lista de archivos por remover
  useEffect(() => {
    if (listFilesToRemove.length > 0) {
      let newLength = listFilesToRemove.length;
      if (newLength > maxLengthListToRemove) {setMaxLengthListToRemove(newLength)}
      if (!fileToRemove && (newLength === counterChangesOfDesync || maxLengthListToRemove === counterChangesOfDesync)) {
        let ftr = listFilesToRemove[0];
        setFileToRemove(ftr);
      }
    } else if (listFilesToRemove.length === 0) {
      setMaxLengthListToRemove(0);
      setCounterChangesOfDesync(0);
    }
  }, [listFilesToRemove])

  //Método para añadir un nuevo archivo
  useEffect(() => {
    if (fileToAdd) {
      const remoteURI = `http://${ipServer}:8000/download/${fileToAdd.id}`;

      download(remoteURI, fileToAdd.localURI);
    }
  }, [fileToAdd]);

  //Método para remover un archive
  useEffect(() => {
    if (fileToRemove) {
      remove(fileToRemove.localURI);
    }
  }, [fileToRemove]);

  return <></>;
}
