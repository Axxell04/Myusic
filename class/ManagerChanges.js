import { useContext, useEffect } from "react";
import {
  ConfirmChangesContext,
  ListChangesContext,
  PlsTargetChangesContext,
} from "../providers/ProviderChanges";
import { RequestStateContext } from "../providers/ProviderModels";

import { RequestModel } from "../models/RequestModel";
import { PlsModel } from "../models/PlsModel";
import { MusicModel, MusicChangeModel } from "../models/MusicModel";

export function ManagerChanges() {
  const { plsTargetChanges, setPlsTargetChanges } = useContext(
    PlsTargetChangesContext
  );
  const { listChanges, setListChanges } = useContext(ListChangesContext);
  const { confirmChanges, setConfirmChanges } = useContext(
    ConfirmChangesContext
  );
  const { requestState, setRequestState } = useContext(RequestStateContext);

  useEffect(() => {
    console.log(confirmChanges);
    console.log(requestState);
    if (confirmChanges && !requestState) {
      if (listChanges.length > 0) {
        console.log(listChanges.length);
        let musicChange = new MusicChangeModel();
        musicChange = listChanges[0];
        if (musicChange.command === "sync") {
          setRequestState(
            new RequestModel(
              "syncMusicToPls",
              plsTargetChanges,
              musicChange.music
            )
          );
        }
        //Retira el musicChange que ya fue realizado
        setListChanges(listChanges.filter((musicChange) => {
            console.log("Index: "+listChanges.indexOf(musicChange))
          return listChanges.indexOf(musicChange) != 0;
        }))
        /// ## RECARGAR LA LISTA DE MUSICAS LUEGO DE REALIZAR LOS CAMBIOS
      } else {
        setConfirmChanges(false);
      }
    }
  }, [confirmChanges, requestState]);
  return <></>;
}
