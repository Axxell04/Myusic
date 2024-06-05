import { createContext, useState } from "react";

export const FileToAddContext = createContext(null);
export const FileToRemoveContext = createContext(null);

export function ProviderFiles ({ children }) {
    const [fileToAdd, setFileToAdd] = useState();
    const [fileToRemove, setFileToRemove] = useState();

    return (
        <FileToAddContext.Provider value={{fileToAdd, setFileToAdd}}>
            <FileToRemoveContext.Provider value={{fileToRemove, setFileToRemove}}>
                { children }
            </FileToRemoveContext.Provider>
        </FileToAddContext.Provider>
    )
}