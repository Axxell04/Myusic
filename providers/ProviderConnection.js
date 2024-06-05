import { createContext, useEffect, useState } from "react";
import WS from "../WS";


export const IpServerContext = createContext(null);
export const WsConnectContext = createContext(null);
export const ManagerWSContext = createContext(new WS());

export function ProviderConnection({children}) {
    const [ipServer, setIpServer] = useState("");
    const [wsConnected, setWsConnected] = useState(false);
    const [managerWS, setManagerWs] = useState(new WS(setWsConnected))

    return (
        <IpServerContext.Provider value={{ipServer, setIpServer}}>
            <WsConnectContext.Provider value={wsConnected}>
                <ManagerWSContext.Provider value={managerWS}>
                    {children}
                </ManagerWSContext.Provider>
            </WsConnectContext.Provider>
        </IpServerContext.Provider>
    )
}
