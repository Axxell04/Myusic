import { createContext, useContext, useEffect, useState } from "react";
import { ManagerWSContext, WsConnectContext } from "./ProviderConnection";
// import { IdListTrackContext, PlsSelectedContext } from "./ProviderSelections";

export const ListMusicsContext = createContext(null);
export const ListPlsContext = createContext(null);
export const ListTrackContext = createContext(null);

export const ListLocalPlsContext = createContext(null);
export const ListLocalMusicsContext = createContext(null);

export const UpdateListLocalPlsContext = createContext(null);
export const UpdateListLocalMusicsContext = createContext(null);

export const TrackSelectedContext = createContext(null);

export function ProviderLists({ children }) {
  const managerWS = useContext(ManagerWSContext);
  const wsConnected = useContext(WsConnectContext);
  // const { idListTrack } = useContext(IdListTrackContext);

  //FUNCTIONS UPDATE
  const [updateListLocalPls, setUpdateListLocalPls] = useState(false);
  const [updateListLocalMusics, setUpdateListLocalMusics] = useState(false);

  //LISTS LOCAL
  const [listLocalPls, setListLocalPls] = useState([]);
  const [listLocalMusics, setListLocalMusics] = useState([]);

  //LISTS REMOTE
  const [listMusics, setListMusics] = useState([]);
  const [listPls, setListPls] = useState([]);

  //TRACKED LIST
  const [listTrack, setListTrack] = useState([]);

  //TRACK SELECTED
  const [trackSelected, setTrackSelected] = useState(null);

  managerWS.setSetterListMusics(setListMusics);
  managerWS.setSetterListPls(setListPls);
  managerWS.setSetterListTrack(setListTrack);

  useEffect(() => {
    if (listMusics) {
      managerWS.updateListMusics(listMusics);
    }
  }, [listMusics]);
  useEffect(() => {
    if (wsConnected) {
      setListPls([{ id: 0, name: "Biblioteca" }]);
    } else {
      setUpdateListLocalPls(true);
      setListLocalMusics([]);
      
    }
  }, [wsConnected]);
  useEffect(() => {
    if (listPls) {
      managerWS.updateListPls(listPls);
    }
  }, [listPls]);

  return (
    <UpdateListLocalPlsContext.Provider
      value={{ updateListLocalPls, setUpdateListLocalPls }}
    >
      <UpdateListLocalMusicsContext.Provider
        value={{ updateListLocalMusics, setUpdateListLocalMusics }}
      >
        <ListLocalPlsContext.Provider value={{ listLocalPls, setListLocalPls }}>
          <ListLocalMusicsContext.Provider
            value={{ listLocalMusics, setListLocalMusics }}
          >
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
          </ListLocalMusicsContext.Provider>
        </ListLocalPlsContext.Provider>
      </UpdateListLocalMusicsContext.Provider>
    </UpdateListLocalPlsContext.Provider>
  );
}
