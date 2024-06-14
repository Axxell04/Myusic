import { createContext, useContext, useEffect, useState } from "react";
import { ChangesInProcessContext } from "./ProviderProcesses";

export const SectionChangesContext = createContext(null);
export const ListChangesContext = createContext(null);
export const TotalChangesContext = createContext(null);
export const DoneChangesContext = createContext(null);
export const PlsTargetChangesContext = createContext(null);
export const ConfirmChangesContext = createContext(null);
export const CounterChangesOfSyncContext = createContext(null);
export const CounterChangesOfDesyncContext = createContext(null);

export function ProviderChanges({ children }) {
  const [sectionChangesIsVisible, setSectionChangesIsVisible] = useState(true);
  const [plsTargetChanges, setPlsTargetChanges] = useState();
  const [listChanges, setListChanges] = useState([]);
  const [totalChanges, setTotalChanges] = useState(0);
  const [doneChanges, setDoneChanges] = useState(0);
  const [confirmChanges, setConfirmChanges] = useState(false);

  //COUNTERS
  const [counterChangesOfSync, setCounterChangesOfSync] = useState(0);
  const [counterChangesOfDesync, setCounterChangesOfDesync] = useState(0);

  //PROCESS CHANGES
  const {changesInProcess, setChangesInProcess} = useContext(ChangesInProcessContext);

  useEffect(() => {
    let counterSync = 0;
    let counterDesync = 0;
    listChanges.map((musicChange) => {
      if (musicChange.command === "sync") {
        counterSync++;
      } else if (musicChange.command === "desync") {
        counterDesync++;
      }
    })
    //console.log("CounterSync: "+counterSync);
    //console.log("CounterDesync: "+counterDesync);
    if (!changesInProcess) {
      setCounterChangesOfSync(counterSync);
      setCounterChangesOfDesync(counterDesync);
    }
  }, [listChanges]);
  return (
    <SectionChangesContext.Provider
      value={{ sectionChangesIsVisible, setSectionChangesIsVisible }}
    >
      <PlsTargetChangesContext.Provider
        value={{ plsTargetChanges, setPlsTargetChanges }}
      >
        <CounterChangesOfSyncContext.Provider
          value={{ counterChangesOfSync, setCounterChangesOfSync }}
        >
          <CounterChangesOfDesyncContext.Provider
            value={{ counterChangesOfDesync, setCounterChangesOfDesync }}
          >
            <ListChangesContext.Provider
              value={{ listChanges, setListChanges }}
            >
              <TotalChangesContext.Provider
                value={{ totalChanges, setTotalChanges }}
              >
                <DoneChangesContext.Provider
                  value={{ doneChanges, setDoneChanges }}
                >
                  <ConfirmChangesContext.Provider
                    value={{ confirmChanges, setConfirmChanges }}
                  >
                    {children}
                  </ConfirmChangesContext.Provider>
                </DoneChangesContext.Provider>
              </TotalChangesContext.Provider>
            </ListChangesContext.Provider>
          </CounterChangesOfDesyncContext.Provider>
        </CounterChangesOfSyncContext.Provider>
      </PlsTargetChangesContext.Provider>
    </SectionChangesContext.Provider>
  );
}
