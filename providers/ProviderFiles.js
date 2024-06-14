import { createContext, useEffect, useState } from "react";

export const FileToAddContext = createContext(null);
export const FileToRemoveContext = createContext(null);
export const ListFilesToAddContext = createContext(null);
export const ListFilesToRemoveContext = createContext(null);
export const InitProcessAddContext = createContext(null);
export const InitProcessRemoveContext = createContext(null);

export function ProviderFiles({ children }) {
  const [fileToAdd, setFileToAdd] = useState();
  const [fileToRemove, setFileToRemove] = useState();
  const [listFilesToAdd, setListFilesToAdd] = useState([]);
  const [listFilesToRemove, setListFilesToRemove] = useState([]);
  const [initProcessAdd, setInitProcessAdd] = useState(false);
  const [initProcessRemove, setInitProcessRemove] = useState(false);

  //Actualiza la lista de archivos por añadir
  useEffect(() => {
    if (fileToAdd) {
      setListFilesToAdd([...listFilesToAdd, fileToAdd])
      setFileToAdd(null);
    }
  }, [fileToAdd])

  //Actualiza la lista de archivos por remover
  useEffect(() => {
    if (fileToRemove) {
      setListFilesToRemove([...listFilesToRemove, fileToRemove])
      setFileToRemove(null);
    }
  }, [fileToRemove])

  return (
    <ListFilesToAddContext.Provider
      value={{ listFilesToAdd, setListFilesToAdd }}
    >
      <ListFilesToRemoveContext.Provider
        value={{ listFilesToRemove, setListFilesToRemove }}
      >
        <FileToAddContext.Provider value={{ fileToAdd, setFileToAdd }}>
          <FileToRemoveContext.Provider
            value={{ fileToRemove, setFileToRemove }}
          >
            <InitProcessAddContext.Provider
              value={{ initProcessAdd, setInitProcessAdd }}
            >
              <InitProcessRemoveContext.Provider
                value={{ initProcessRemove, setInitProcessRemove }}
              >
                {children}
              </InitProcessRemoveContext.Provider>
            </InitProcessAddContext.Provider>
          </FileToRemoveContext.Provider>
        </FileToAddContext.Provider>
      </ListFilesToRemoveContext.Provider>
    </ListFilesToAddContext.Provider>
  );
}
