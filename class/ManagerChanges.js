import { useContext, useEffect, useState } from "react";
//import * as FileSystem from "expo-file-system"
import { PlsModel } from "../models/PlsModel";
import { MusicModel, MusicChangeModel } from "../models/MusicModel";
export class ManagerChanges {
  listChanges = []
  doneChanges = 0
  plsTargetChanges = undefined;
  managerModels = undefined;
  setterChangesInProcess = undefined;
  setterCounterChangesTotal = undefined;
  setterCounterDoneChanges = undefined;
  setterCounterChangesOfSync = undefined;
  setterCounterChangesOfDesync = undefined;


  setPlsTargetChanges (plsTargetChanges) {
    this.plsTargetChanges = plsTargetChanges;
  }
  setManagerModels (manager) {
    this.managerModels = manager;
  }

  setSetterChangesInProcess (setter) {
    this.setterChangesInProcess = setter;
  }
  setSetterCounterChangesTotal(setter) {
    this.setterCounterChangesTotal = setter;
  }
  setSetterCounterDoneChanges(setter) {
    this.setterCounterDoneChanges = setter;
  }
  setSetterCounterChangesOfSync(setter) {
    this.setterCounterChangesOfSync = setter;
  }
  setSetterCounterChangesOfDesync(setter) {
    this.setterCounterChangesOfDesync = setter;
  }

  getListChanges() {
    return this.listChanges;
  }
  
  addChange(musicChange = new MusicChangeModel()) {
    this.listChanges.push(musicChange);
    if (this.setterCounterChangesTotal) {
      this.setterCounterChangesTotal(this.listChanges.length);
    }
  }

  removeChange(musicId) {
    this.listChanges = this.listChanges.filter((musicChange) => {
      return musicChange.music.id != musicId;
    });
    if (this.setterCounterChangesTotal) {
      this.setterCounterChangesTotal(this.listChanges.length);
    }
  }

  removeAllChanges() {
    this.listChanges = [];
    if (this.setterCounterChangesTotal) {
      this.setterCounterChangesTotal(0);
    }
  }

  checkChange(musicId) {
    const changeFind = this.listChanges.find((musicChange) => {
      return musicChange.music.id === musicId;
    })
    
    return changeFind ? true : false;
  }

  async makeChanges() {
    this.setterChangesInProcess(true);
    const plsTarget = this.plsTargetChanges;
    for (let change of this.listChanges) {
      // let change = new MusicChangeModel() //Borrar esta línea
      if (change.command === "sync") {
        await this.managerModels.syncMusicToPls(plsTarget, change.music);
        this.doneChanges += 1;
        this.setterCounterDoneChanges(this.doneChanges);
      } else if (change.command === "desync") {
        await this.managerModels.desyncMusicToPls(plsTarget, change.music);
        this.doneChanges += 1;
        this.setterCounterDoneChanges(this.doneChanges);
      }
    }
    this.listChanges = [];
    this.doneChanges = 0;
    this.setterCounterChangesTotal(0);
    this.setterCounterDoneChanges(0);
    this.setterChangesInProcess(false);
    //this.managerModels.refreshSyncPls();
  }

  setListChanges(listChanges) {
    this.listChanges = listChanges;
  }

  printListChanges() {
    console.log(this.listChanges);
  }
}

export function OldManagerChanges() {
  // const { plsTargetChanges, setPlsTargetChanges } = useContext(
  //   PlsTargetChangesContext
  // );
  // const { listChanges, setListChanges } = useContext(ListChangesContext);
  // const { confirmChanges, setConfirmChanges } = useContext(
  //   ConfirmChangesContext
  // );
  
  // const {listFilesToAdd} = useContext(ListFilesToAddContext);


  // const [mg, setMg] = useState(new MG())

  // useEffect(() => {
  //   mg.setListChanges(listChanges);
  //   mg.printListChanges();
  // }, [listChanges])

  // useEffect(() => {
  //   // console.log(confirmChanges);
  //   //##PETICIÓN 2 Y 3 SE ENVÍAN PRACTICAMENTE A LA VEZ POR LO QUE LA LISTA DE ARCHIVOS POR AÑADIR NO ES CONSISTENTE
  //   //console.log(requestState);
  //   //console.log(listFilesToAdd);
  //   if (confirmChanges && !requestState) {
  //     if (listChanges.length > 0) {
        
  //       let musicChange = new MusicChangeModel();
  //       musicChange = listChanges[0];
  //       if (musicChange.command === "sync") {
  //         setRequestState(
  //           new RequestModel(
  //             "syncMusicToPls",
  //             plsTargetChanges,
  //             musicChange.music
  //           )
  //         );
  //       } else if (musicChange.command === "desync") {
  //         setRequestState(
  //           new RequestModel(
  //             "desyncMusicToPls",
  //             plsTargetChanges,
  //             musicChange.music
  //           )
  //         )
  //       }
  //       //Retira el musicChange que ya fue realizado
  //       setListChanges(listChanges.filter((musicChange) => {
  //           //console.log("Index: "+listChanges.indexOf(musicChange))
  //         return listChanges.indexOf(musicChange) != 0;
  //       }))
  //     } else {
  //       setConfirmChanges(false);
  //     }
  //   }
  // }, [confirmChanges, requestState]);
  return <></>;
}
