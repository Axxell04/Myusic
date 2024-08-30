import { createContext, useContext, useEffect, useState } from "react";
import { ManagerModels } from "../class/ManagerModels";
import { ListLocalMusicsContext, ListLocalPlsContext } from "./ProviderLists";
import { ManagerFilesContext } from "./ProviderFiles";
import { IpServerContext, WsConnectContext } from "./ProviderConnection";

export const ManagerModelsContext = createContext(new ManagerModels());

export function ProviderModels ({ children }) {
    const { setListLocalMusics } = useContext(ListLocalMusicsContext)
    const { setListLocalPls } = useContext(ListLocalPlsContext);

    const {ipServer} = useContext(IpServerContext);
    const wsConnected = useContext(WsConnectContext)
    const managerFiles = useContext(ManagerFilesContext);

    const [managerModels, setManagerModels] = useState(new ManagerModels());

    useEffect(()=>{
        managerModels.setSetterListLocalMusics(setListLocalMusics);
        managerModels.setSetterListLocalPls(setListLocalPls);
        managerModels.setManagerFiles(managerFiles);
    
        managerModels.initDB();
    }, [])

    useEffect(() => {
        managerModels.setIpServer(ipServer);
    }, [ipServer])

    useEffect(() => {
        managerModels.refreshSyncPls();
    }, [wsConnected])

    return (
        <ManagerModelsContext.Provider value={managerModels}>
            {children}
        </ManagerModelsContext.Provider>
    )
}