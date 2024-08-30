import { createContext, useEffect, useState } from "react";
import { ManagerFiles } from "../class/ManagerFiles";

export const ManagerFilesContext = createContext(new ManagerFiles());

export function ProviderFiles({ children }) {
  const [managerFiles, setManagerFiles] = useState(new ManagerFiles());

  useEffect(() => {
    managerFiles.init();
  }, []);

  return (
    <ManagerFilesContext.Provider value={managerFiles}>
      {children}
    </ManagerFilesContext.Provider>
  );
}
