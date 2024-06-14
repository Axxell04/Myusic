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
import { ListFilesToAddContext } from "../providers/ProviderFiles";

export function ManagerChanges() {
  const { plsTargetChanges, setPlsTargetChanges } = useContext(
    PlsTargetChangesContext
  );
  const { listChanges, setListChanges } = useContext(ListChangesContext);
  const { confirmChanges, setConfirmChanges } = useContext(
    ConfirmChangesContext
  );
  const { requestState, setRequestState } = useContext(RequestStateContext);
  
  const {listFilesToAdd} = useContext(ListFilesToAddContext);

  useEffect(() => {
    // console.log(confirmChanges);
    //##PETICIÓN 2 Y 3 SE ENVÍAN PRACTICAMENTE A LA VEZ POR LO QUE LA LISTA DE ARCHIVOS POR AÑADIR NO ES CONSISTENTE
    console.log(requestState);
    console.log(listFilesToAdd);
    if (confirmChanges && !requestState) {
      if (listChanges.length > 0) {
        
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
        } else if (musicChange.command === "desync") {
          setRequestState(
            new RequestModel(
              "desyncMusicToPls",
              plsTargetChanges,
              musicChange.music
            )
          )
        }
        //Retira el musicChange que ya fue realizado
        setListChanges(listChanges.filter((musicChange) => {
            //console.log("Index: "+listChanges.indexOf(musicChange))
          return listChanges.indexOf(musicChange) != 0;
        }))
      } else {
        setConfirmChanges(false);
      }
    }
  }, [confirmChanges, requestState]);
  return <></>;
}
