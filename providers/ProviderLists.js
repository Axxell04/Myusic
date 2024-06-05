import { createContext, useContext, useEffect, useState } from "react";
import { ManagerWSContext } from "./ProviderConnection";
import { IdListTrackContext, PlsSelectedContext } from "./ProviderSelections";

export const ListMusicsContext = createContext(null);
export const ListPlsContext = createContext(null);
export const ListTrackContext = createContext(null);

export const TrackSelectedContext = createContext(null);

export function ProviderLists({ children }) {
  const managerWS = useContext(ManagerWSContext);
  // const { plsSelected } = useContext(PlsSelectedContext);
  const {idListTrack} = useContext(IdListTrackContext);
  const [listMusics, setListMusics] = useState([]);
  const [listPls, setListPls] = useState([
    { id: 0, name: "Todas las canciones" },
  ]);
  const [listTrack, setListTrack] = useState([]);
  const [trackSelected, setTrackSelected] = useState(null);

  managerWS.setSetterListMusics(setListMusics);
  managerWS.setSetterListPls(setListPls);
  managerWS.setSetterListTrack(setListTrack);

  useEffect(() => {
    if (listMusics) {
      managerWS.updateListMusics(listMusics);
      //Cuando se eliminan canciones, y hay una playlist reproduciendo, verificar que esa playlist no contenga canciones que han sido eliminadas
    }
  }, [listMusics]);
  useEffect(() => {
    managerWS.updateIdListTrack(idListTrack);
  }, [idListTrack])
  useEffect(() => {
    if (listPls) {
      managerWS.updateListPls(listPls);
    }
  }, [listPls]);

  return (
    <ListMusicsContext.Provider value={{ listMusics, setListMusics }}>
      <ListPlsContext.Provider value={{ listPls, setListPls }}>
        <ListTrackContext.Provider value={{ listTrack, setListTrack }}>
          <TrackSelectedContext.Provider
            value={{ trackSelected, setTrackSelected }}
          >
            {children}
          </TrackSelectedContext.Provider>
        </ListTrackContext.Provider>
      </ListPlsContext.Provider>
    </ListMusicsContext.Provider>
  );
}
