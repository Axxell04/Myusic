import { useContext, useEffect, useState } from "react";
import {
  ListLocalMusicsContext,
  ListLocalPlsContext,
  ListMusicsContext,
} from "../providers/ProviderLists";
import { RequestStateContext } from "../providers/ProviderModels";

import * as SQLite from "expo-sqlite/next";
import * as FileSystem from "expo-file-system";

import { RequestModel } from "../models/RequestModel";
import { PlsModel } from "../models/PlsModel";
import { MusicModel } from "../models/MusicModel";
import {
  FileToAddContext,
  FileToRemoveContext,
  ListFilesToAddContext,
  ListFilesToRemoveContext,
} from "../providers/ProviderFiles";
import { PlsSelectedContext } from "../providers/ProviderSelections";
import { DoneChangesContext } from "../providers/ProviderChanges";

export function ManagerModels() {
  const [db, setDB] = useState();
  //const [db, setDB] = useState(SQLite.openDatabaseSync());

  const { requestState, setRequestState } = useContext(RequestStateContext);

  //MANAGER FILES
  const { fileToAdd, setFileToAdd } = useContext(FileToAddContext);
  const { fileToRemove, setFileToRemove } = useContext(FileToRemoveContext);
  const {listFilesToAdd, setListFilesToAdd} = useContext(ListFilesToAddContext);
  const {listFilesToRemove, setListFilesToRemove} = useContext(ListFilesToRemoveContext);

  //LIST LOCAL
  const { listLocalPls, setListLocalPls } = useContext(ListLocalPlsContext);
  const { listLocalMusics, setListLocalMusics } = useContext(
    ListLocalMusicsContext
  );

  const {listMusics, setListMusics} = useContext(ListMusicsContext);

  //PLS SELECTED
  const { plsSelected, setPlsSelected } = useContext(PlsSelectedContext);

  //COUNTER CHANGES
  const {doneChanges, setDoneChanges} = useContext(DoneChangesContext);

  //Método para sincronizar una canción a una pls
  const syncMusicToPls = async (
    pls = new PlsModel(),
    music = new MusicModel()
  ) => {
    const resPls = await db.getFirstAsync(
      "SELECT * FROM pls WHERE id = ?",
      pls.id
    );
    if (!resPls) {
      await db.runAsync("INSERT INTO pls (id, name) VALUES (?,?)", [
        pls.id,
        pls.name,
      ]);
    }
    const resMusic = await db.getFirstAsync(
      "SELECT * FROM music WHERE id = ?",
      music.id
    );
    if (!resMusic) {
      const localURI = `${FileSystem.documentDirectory}musics/${pls.name}/${music.name}.mp3`;
      //setFileToAdd({ id: music.id, localURI: localURI });
      setListFilesToAdd([...listFilesToAdd, {id: music.id, localURI: localURI}])
      console.log("Mandando a agreagar: "+localURI)
      music.URI = localURI;
      await db.runAsync(
        "INSERT INTO music (id, name, author, duration, uri) VALUES (?,?,?,?,?)",
        [music.id, music.name, music.author, music.duration, music.URI]
      );
    }

    await db.runAsync("INSERT INTO pls_music (id_pls, id_music) VALUES (?,?)", [
      pls.id,
      music.id,
    ]);
    getSyncMusicToPls();
    //setRequestState(null);
    //setDoneChanges(doneChanges+1);
  };

  //ESPERA HASTA QUE SE VEA REFLEJADO EL CAMBIO EN LAS LISTAS DE ARCHIVOS PARA INDICAR QUE SE PUEDE REALIZAR OTRA PETICIÓN
  useEffect(() => {
    if (requestState) {
      setRequestState(null);
    }
  }, [listFilesToAdd, listFilesToRemove])

  //Método para desincronizar una canción a una pls
  const desyncMusicToPls = async (pls = new PlsModel(), music = new MusicModel()) => {
    let resMusic = await db.getFirstAsync("SELECT * FROM music WHERE id = ?", music.id);
    if (resMusic) {
      await db.runAsync("DELETE FROM pls_music WHERE id_pls = ? AND id_music = ?", [pls.id, music.id]);
      music.URI = resMusic.uri;
      await checkSyncMusicExists(music);
      await checkSyncPlsExists(pls);
    }
    getSyncMusicToPls();
    //setRequestState(null);
    //setDoneChanges(doneChanges+1);
  };

  //Verifica si una canción sigue estando asociada a alguna pls existente
  const checkSyncMusicExists = async (music = new MusicModel()) => {
    //##SE ESTÁ BORRANDO LA MUSIC ANQUE SE ENCUENTRE REGISTRADA EN OTRA PLS
    const resMusicSync = await db.getFirstAsync("SELECT * FROM pls_music WHERE id_music = ?", music.id);
    //console.log(await db.getAllAsync("SELECT * FROM pls_music"));
    if (!resMusicSync) {
      await db.runAsync("DELETE FROM music WHERE id = ?", music.id);
      //setFileToRemove({localURI: music.URI});
      setListFilesToRemove([...listFilesToRemove, {localURI: music.URI}]);
    } else {
      setDoneChanges(doneChanges+1);
      setRequestState(null);
    }
  };

  //Verifica si una pls sigue teniendo alguna canción asociada
  const checkSyncPlsExists = async (pls = new PlsModel()) => {
    const resPlsSync = await db.getFirstAsync("SELECT * FROM pls_music WHERE id_pls = ?", pls.id);
    if (!resPlsSync) {
      await db.runAsync("DELETE FROM pls WHERE id = ?", pls.id);
      // const localURI = FileSystem.documentDirectory+"musics/"+pls.name
      // const infoDir = await FileSystem.getInfoAsync(localURI);
      // if (infoDir.exists) {
      //   //setFileToRemove({localURI: localURI});
      //   setListFilesToRemove([...listFilesToRemove, {localURI: localURI}]);
      // }
    }
  };

  //Actualiza el contexto de la lista de pls sincronizadas
  const getSyncPls = async () => {
    const resPls = await db.getAllAsync("SELECT * FROM pls");
    //console.log(resPls);
    setListLocalPls(resPls ? resPls : []);
    setRequestState(null);
  };

  //Actualiza el contexto de la lista de canciones sincronizadas a dicha pls
  const getSyncMusicToPls = async () => {
    //console.log(plsSelected)
    if (plsSelected) {
      const resMusic = await db.getAllAsync(
        "SELECT * FROM music JOIN pls_music ON music.id = pls_music.id_music WHERE pls_music.id_pls = ?", plsSelected);
      
      if (resMusic.length > 0) {
        setListLocalMusics(resMusic);
        //console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII"+resMusic.length)
      } else {
        setListLocalMusics([]);
      }
    }
    setRequestState(null);
  };

  //Retira una canción de todas las pls a las que se encuentra asociada y borra su archivo local
  const desyncFullMusic = async (music) => {};

  //Retira todas la canciones asociadas a esta pls, verifica luego de remover cada canción con el método checkSyncMusicExists y borra el registro de esta pls
  const desyncFullPls = async (pls) => {};

  //Manejo de métodos del mode Pls
  useEffect(() => {
    if (requestState) {
      let request = new RequestModel();
      request = requestState;
      if (request.method === "syncMusicToPls") {
        syncMusicToPls(request.pls, request.music);
      } else if (request.method === "desyncMusicToPls") {
        desyncMusicToPls(request.pls, request.music);
      } else if (request.method === "getSyncPls") {
        getSyncPls();
      } else if (request.method === "getSyncMusicToPls") {
        getSyncMusicToPls();
      } else if (request.method === "desyncFullMusic") {
        desyncFullMusic(request.music);
      } else if (request.method === "desyncFullPls") {
        desyncFullPls(request.pls);
      }
    }
  }, [requestState]);

  const getDB = async () => {
    await initDB();
    setDB(
      await SQLite.openDatabaseAsync("myusic.db", { useNewConnection: true })
    );
  };

  useEffect(() => {
    //console.log(db);
    if (!db) {
      getDB();
    } else {
      getSyncPls();
    }
  }, [db]);

  useEffect(() => {
    getDB();
  }, []);

  return <></>;
}

async function initDB() {
  //await FileSystem.deleteAsync(FileSystem.documentDirectory + "SQLite");
  const db = await SQLite.openDatabaseAsync("myusic.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pls (
        id INTEGER PRIMARY KEY NOT NULL,
        name VARCHAR(30) NOT NULL UNIQUE
        );

    CREATE TABLE IF NOT EXISTS music (
        id INTEGER PRIMARY KEY NOT NULL,
        name VARCHAR(40) NOT NULL,
        author VARCHAR(40) NOT NULL,
        duration VARCHAR(6) NOT NULL,
        uri TEXT NOT NULL
        );

    CREATE TABLE IF NOT EXISTS pls_music (
        id_pls INTEGER NOT NULL,
        id_music INTEGER NOT NULL,
        PRIMARY KEY (id_pls, id_music),
        FOREIGN KEY (id_pls) REFERENCES pls(id),
        FOREIGN KEY (id_music) REFERENCES music(id)
        );
    `);
  //await db.runAsync("INSERT INTO pls (name) VALUES (?)", "Playlist 1");
  //const res = await db.getFirstAsync("SELECT * FROM pls");
  // const res = await db.getAllAsync("SELECT * FROM pls");
  // console.log(res);
}
