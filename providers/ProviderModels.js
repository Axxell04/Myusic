import { createContext, useState } from "react";

export const RequestStateContext = createContext(null);

export function ProviderModels ({ children }) {
    const [requestState, setRequestState] = useState();

    return (
        <RequestStateContext.Provider value={{requestState, setRequestState}}>
            { children }
        </RequestStateContext.Provider>
    )
}