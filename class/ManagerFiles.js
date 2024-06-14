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
import { CounterChangesOfDesyncContext, CounterChangesOfSyncContext, DoneChangesContext, UpdateDoneChangesContext } from "../providers/ProviderChanges";
import { RequestStateContext } from "../providers/ProviderModels";

export function ManagerFiles() {
  const { ipServer } = useContext(IpServerContext);
  const { fileToAdd, setFileToAdd } = useContext(FileToAddContext);
  const { fileToRemove, setFileToRemove } = useContext(FileToRemoveContext);

  const {listFilesToAdd, setListFilesToAdd} = useContext(ListFilesToAddContext);
  const {listFilesToRemove, setListFilesToRemove} = useContext(ListFilesToRemoveContext);

  const { doneChanges, setDoneChanges } = useContext(DoneChangesContext);
  const {updateDoneChanges, setUpdateDoneChanges} = useContext(UpdateDoneChangesContext);

  const {initProcessAdd, setInitProcessAdd} = useContext(InitProcessAddContext);
  const {initProcessRemove, setInitProcessRemove} = useContext(InitProcessRemoveContext);

  const {counterChangesOfSync, setCounterChangesOfSync} = useContext(CounterChangesOfSyncContext);
  const {counterChangesOfDesync, setCounterChangesOfDesync} = useContext(CounterChangesOfDesyncContext);

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
    if (!localURI) {
      function a() {console.log("A")}
      await new Promise((a) => {setTimeout(() => {
        a();
      }, 1000)})
      return
    }

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
  
  };

  const remove = async (localURI) => {
    if (!localURI) {
      function a() {console.log("A")}
      await new Promise((a) => {setTimeout(() => {
        a();
      }, 1000)})
      console.log("Eliminando: "+localURI)
      return
    }

    const infoDir = await FileSystem.getInfoAsync(localURI);
    if (infoDir.exists) {
      await FileSystem.deleteAsync(localURI);
      console.log("Eliminando: " + localURI);
    }
  };

  const processListAdd = async () => {
    console.log(listFilesToAdd)
    for (const fta of listFilesToAdd) {
      //console.log(fta)
      const remoteURI = `http://${ipServer}:8000/download/${fta.id}`;
      await download(remoteURI, fta.localURI);
      setUpdateDoneChanges(listFilesToAdd.indexOf(fta)+1);
    }
    setListFilesToAdd([]);
  }

  const processListRemove = async () => {
    console.log(listFilesToRemove)
    for (const ftr of listFilesToRemove) {
      //console.log(ftr)
      await remove(ftr.localURI)
      setUpdateDoneChanges(listFilesToRemove.indexOf(ftr)+1);
    }
    setListFilesToRemove([]);
  }

  //Detectanto si se puede iniciar con el procesamiento de la lista de archivos por añadir
  useEffect(() => {
    //##AL PARECER CUANDO LISTFILESTOADD.LENGTH CAMBIA A 1 ESTA YA DETECTA QUE INITPROCESSADD YA ES TRUE
    // console.log("ListFilesToAddLength: "+listFilesToAdd.length);
    // console.log("CounterChangesOfSync: "+counterChangesOfSync);
    // console.log("MaxLength: "+maxLengthListToAdd);
    if (listFilesToAdd.length > 0) {
      if (listFilesToAdd.length === counterChangesOfSync) {
        processListAdd();
      }
    } else if (listFilesToAdd.length === 0) {
      //setCounterChangesOfSync(0);
    }
  }, [listFilesToAdd])

  //Detectando si se puede iniciar con el procesamiento de la lista de archivos por remover
  useEffect(() => {
    if (listFilesToRemove.length > 0) {
      if (listFilesToRemove.length === counterChangesOfDesync) {
        processListRemove();
      }
    } else if (listFilesToRemove.length === 0) {
      //setCounterChangesOfDesync(0);
    }
  }, [listFilesToRemove])

  return <></>;
}
