import { createContext, useContext, useEffect, useState } from "react";
import { ChangesInProcessContext } from "./ProviderProcesses";
import { ManagerChanges } from "../class/ManagerChanges";
import { ManagerModelsContext } from "./ProviderModels";

export const PlsTargetChangesContext = createContext(null);
export const CounterChangesTotalContext = createContext(null);
export const CounterDoneChangesContext = createContext(null);

export const ManagerChangesContext = createContext(new ManagerChanges());

export function ProviderChanges({ children }) {
  //PLS TARGET CHANGES
  const [plsTargetChanges, setPlsTargetChanges] = useState();

  //COUNTERS
  const [counterChangesTotal, setCounterChangesTotal] = useState(0);
  const [counterDoneChanges, setCounterDoneChanges] = useState(0);

  //MANAGER MODELS
  const managerModels = useContext(ManagerModelsContext);

  //MANAGER CHANGES
  const [managerChanges, setManagerChanges] = useState(new ManagerChanges());

  //PROCESS CHANGES
  const { setChangesInProcess } = useContext(ChangesInProcessContext);

  //Estableciendo las funcionalidades al manager
  useEffect(() => {
    managerChanges.setSetterCounterChangesTotal(setCounterChangesTotal);
    managerChanges.setSetterCounterDoneChanges(setCounterDoneChanges);
    managerChanges.setSetterChangesInProcess(setChangesInProcess);

    managerChanges.setManagerModels(managerModels);
  }, []);

  useEffect(() => {
    managerChanges.setPlsTargetChanges(plsTargetChanges);
  }, [plsTargetChanges]);

  return (
    <PlsTargetChangesContext.Provider
      value={{ plsTargetChanges, setPlsTargetChanges }}
    >
      <CounterChangesTotalContext.Provider
        value={{ counterChangesTotal, setCounterChangesTotal }}
      >
        <CounterDoneChangesContext.Provider
          value={{ counterDoneChanges, setCounterDoneChanges }}
        >
          <ManagerChangesContext.Provider value={managerChanges}>
            {children}
          </ManagerChangesContext.Provider>
        </CounterDoneChangesContext.Provider>
      </CounterChangesTotalContext.Provider>
    </PlsTargetChangesContext.Provider>
  );
}
