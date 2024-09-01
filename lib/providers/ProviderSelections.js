import { createContext, useContext, useEffect, useState } from "react";
import { ManagerWSContext, WsConnectContext } from "./ProviderConnection";
import { ListMusicsContext, UpdateListLocalMusicsContext } from "./ProviderLists";
import { ManagerModelsContext } from "./ProviderModels";

export const PlsSelectedContext = createContext(null);
export const IdListTrackContext = createContext(null);
export const ActiveMusicTitleContext = createContext(null);
export const ActiveMusicAuthorContext = createContext(null);

export function ProviderSelections({ children }) {
  const [plsSelected, setPlsSelected] = useState(0);
  const [idListTrack, setIdListTrack] = useState(-1);
  const [activeMusicTitle, setActiveMusicTitle] = useState("");
  const [activeMusicAuthor, setActiveMusicAuthor] = useState("");

  const {listMusics, setListMusics} = useContext(ListMusicsContext);

  const wsConnected = useContext(WsConnectContext);
  const managerWS = useContext(ManagerWSContext);
  const managerModels = useContext(ManagerModelsContext);

  const { setUpdateListLocalMusics } = useContext(UpdateListLocalMusicsContext);

  useEffect(() => {
    managerModels.setSetterPlsSelected(setPlsSelected);
    managerModels.setPlsSelected(plsSelected);
  }, [])

  useEffect(() => {
    managerWS.updateIdListTrack(idListTrack);
  }, [idListTrack]);

  useEffect(() => {
    managerModels.setPlsSelected(plsSelected)
    if (wsConnected) {
      setListMusics([]);
      if (plsSelected === 0) {
        managerWS.send("get_musics", { all: true });
      } else {
        managerWS.send("get_musics_of_playlist", { id: plsSelected });
        setUpdateListLocalMusics(true);
        managerModels.refreshSyncMusicToPls();
      }
    } else {
      setUpdateListLocalMusics(true);
      managerModels.refreshSyncMusicToPls();
    }
  }, [plsSelected]);

  return (
    <PlsSelectedContext.Provider value={{ plsSelected, setPlsSelected }}>
      <IdListTrackContext.Provider value={{ idListTrack, setIdListTrack }}>
        <ActiveMusicAuthorContext.Provider
          value={{ activeMusicAuthor, setActiveMusicAuthor }}
        >
          <ActiveMusicTitleContext.Provider
            value={{ activeMusicTitle, setActiveMusicTitle }}
          >
            {children}
          </ActiveMusicTitleContext.Provider>
        </ActiveMusicAuthorContext.Provider>
      </IdListTrackContext.Provider>
    </PlsSelectedContext.Provider>
  );
}
