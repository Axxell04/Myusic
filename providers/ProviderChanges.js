import { createContext, useState } from "react"

export const SectionChangesOptContext = createContext(null);
export const ListChangesContext = createContext(null);
export const PlsTargetChangesContext = createContext(null);
export const ManagerChangesContext = createContext(null);

export function ProviderChanges({children}) {

    const [sectionChangesIsVisible, setSectionChangesIsVisible] = useState(true);
    const [plsTargetChanges, setPlsTargetChanges] = useState();
    const [listChanges, setListChanges] = useState([]);
    const [managerChanges, setManagerChanges] = useState();

    return 
    <SectionChangesOptContext.Provider value={{sectionChangesIsVisible, setSectionChangesIsVisible}}>
        <PlsTargetChangesContext.Provider value={{plsTargetChanges, setPlsTargetChanges}}>
            <ListChangesContext.Provider value={{listChanges, setListChanges}}>
                <ManagerChangesContext.Provider value={managerChanges}>
                    {children}
                </ManagerChangesContext.Provider>
            </ListChangesContext.Provider>
        </PlsTargetChangesContext.Provider>
    </SectionChangesOptContext.Provider>
}