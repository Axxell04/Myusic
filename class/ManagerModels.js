import { useContext, useEffect, useState } from "react";
import {
  ListLocalMusicsContext,
  ListLocalPlsContext,
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
} from "../providers/ProviderFiles";
import { PlsSelectedContext } from "../providers/ProviderSelections";

export function ManagerModels() {
  const [db, setDB] = useState();
  //const [db, setDB] = useState(SQLite.openDatabaseSync());

  const { requestState, setRequestState } = useContext(RequestStateContext);

  //MANAGER FILES
  const { fileToAdd, setFileToAdd } = useContext(FileToAddContext);
  const { fileToRemove, setFileToRemove } = useContext(FileToRemoveContext);

  //LIST LOCAL
  const { listLocalPls, setListLocalPls } = useContext(ListLocalPlsContext);
  const { listLocalMusics, setListLocalMusics } = useContext(
    ListLocalMusicsContext
  );

  //PLS SELECTED
  const { plsSelected, setPlsSelected } = useContext(PlsSelectedContext);

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
      setFileToAdd({ id: music.id, localURI: localURI });
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

    console.log(
      await db.getFirstAsync("SELECT * FROM pls WHERE id = ?", pls.id)
    );
    console.log(
      await db.getFirstAsync("SELECT * FROM music WHERE id = ?", music.id)
    );
    console.log(
      await db.getFirstAsync(
        "SELECT * FROM pls_music WHERE id_pls = ? AND id_music",
        [pls.id, music.id]
      )
    );

    setRequestState(null);
  };

  //Método para desincronizar una canción a una pls
  const desyncMusicToPls = async (pls, music) => {};

  //Verifica si una canción sigue estando asociada a alguna pls existente
  const checkSyncMusicExists = async (music) => {};

  //Verifica si una pls sigue teniendo alguna canción asociada
  const checkSyncPlsExists = async (pls) => {};

  //Actualiza el contexto de la lista de pls sincronizadas
  const getSyncPls = async () => {
    const resPls = await db.getAllAsync("SELECT * FROM pls");
    console.log(resPls);
    setListLocalPls(resPls ? resPls : []);
    setRequestState(null);
  };

  //Actualiza el contexto de la lista de canciones sincronizadas a dicha pls
  const getSyncMusicToPls = async () => {
    console.log(plsSelected)
    if (plsSelected) {
      const resMusic = await db.getAllAsync(
        "SELECT * FROM music WHERE id = ?",
        plsSelected
      );
      console.log(resMusic);
      setListLocalMusics(resMusic ? resMusic : []);
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
    console.log(db);
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
