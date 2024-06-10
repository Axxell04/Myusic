import { createContext, useEffect, useState } from "react";

export const SectionChangesContext = createContext(null);
export const ListChangesContext = createContext(null);
export const PlsTargetChangesContext = createContext(null);
export const ConfirmChangesContext = createContext(null);

export function ProviderChanges({ children }) {
  const [sectionChangesIsVisible, setSectionChangesIsVisible] = useState(true);
  const [plsTargetChanges, setPlsTargetChanges] = useState();
  const [listChanges, setListChanges] = useState([]);
  const [confirmChanges, setConfirmChanges] = useState(false);
  useEffect(() => {
    console.log(listChanges)
  }, [listChanges])
  return (
    <SectionChangesContext.Provider
      value={{ sectionChangesIsVisible, setSectionChangesIsVisible }}
    >
      <PlsTargetChangesContext.Provider
        value={{ plsTargetChanges, setPlsTargetChanges }}
      >
        <ListChangesContext.Provider value={{ listChanges, setListChanges }}>
          <ConfirmChangesContext.Provider value={{confirmChanges, setConfirmChanges}}>
            {children}
          </ConfirmChangesContext.Provider>
        </ListChangesContext.Provider>
      </PlsTargetChangesContext.Provider>
    </SectionChangesContext.Provider>
  );
}
